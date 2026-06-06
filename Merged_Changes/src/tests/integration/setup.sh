#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🔄 Starting test database setup..."

# Dynamically get the absolute path to the project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

# Safely load environment variables from the root .env file
if [ -f "$ENV_FILE" ]; then
  echo "📄 Loading environment variables from .env..."
  # set -a automatically exports all variables defined in the sourced file
  set -a 
  source "$ENV_FILE"
  set +a
else
  echo "⚠️ Warning: No .env file found at $ENV_FILE"
fi

# Define Database Credentials 
# (Defaults to root/password if the .env variables are completely empty)
DB_USER=${DB_USER:-"root"}
DB_PASS=${DB_PASSWORD:-"password"}
DB_NAME=${DB_NAME:-"test_ems"}

# Debug check (You can remove these later)
echo "User: $DB_USER"
echo "Target DB: $DB_NAME"

# Export password so MySQL doesn't complain about insecure CLI passwords
export MYSQL_PWD=$DB_PASS

# Step 1: Nuke and rebuild the database
echo "🧹 Dropping and recreating database: $DB_NAME..."
mysql -u "$DB_USER" -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME;"

# Paths for schema and seed files
SCHEMA_FILE="$PROJECT_ROOT/seeders/schema.sql"

# Step 2: Import the Schema
echo "🏗️  Importing schema from $SCHEMA_FILE..."
if [ -f "$SCHEMA_FILE" ]; then
    mysql -u "$DB_USER" "$DB_NAME" < "$SCHEMA_FILE"
else
    echo "❌ Error: Schema file not found at $SCHEMA_FILE"
    exit 1
fi

# Step 3: Import the Seed Data
# Find all matching seed SQL files dynamically
SEED_FILES=$(find "$PROJECT_ROOT/seeders" -type f \( -name "*_seed.sql" -o -name "*.seed.sql" -o -name "*seed.sql" \) | sort)

# Count the found seed files
if [ -z "$SEED_FILES" ]; then
    SEED_COUNT=0
else
    SEED_COUNT=$(echo "$SEED_FILES" | wc -l)
fi

echo "🌱 Found $SEED_COUNT seed files to import..."

# Execute each seed file in alphabetical order
for SEED_FILE in $SEED_FILES; do
    echo "🌱 Importing seed data from $(basename "$SEED_FILE")..."
    if [ -f "$SEED_FILE" ]; then
        mysql -u "$DB_USER" "$DB_NAME" < "$SEED_FILE"
    else
        echo "❌ Error: Seed file not found at $SEED_FILE"
        exit 1
    fi
done

echo "✅ Test database '$DB_NAME' is ready for integration testing!"
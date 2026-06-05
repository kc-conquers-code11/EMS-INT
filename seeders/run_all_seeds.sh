#!/usr/bin/env bash
# Usage: ./run_all_seeds.sh [mysql_user] [mysql_password] [database]
set -euo pipefail
USER="${1:-krrish}"
PASS="${2:-krrish}"
DB="${3:-ems}"
DIR="$(cd "$(dirname "$0")" && pwd)"
run() { mysql -u "$USER" -p"$PASS" "$DB" < "$1"; echo "OK: $1"; }
cd "$DIR"
run "$DIR/admin/ems_admin_seed.sql"
run "$DIR/programme/ems_programme_seed.sql"
run "$DIR/subject/subject_seed.sql"
run "$DIR/exam_fees/exam_fees_seed.sql"
run "$DIR/students/student_seed.sql"
run "$DIR/exam_fees/exam_registrations_seed.sql"
run "$DIR/payment/payment_seed.sql"
run "$DIR/timetable/timetable_seed.sql"
run "$DIR/allocation/block_allocation_seed.sql"
run "$DIR/allocation/student_seating_seed.sql"
run "$DIR/allocation/supervisor_allocation_seed.sql"
run "$DIR/hall_ticket/00_hall_ticket_schema.sql"
run "$DIR/hall_ticket/hall_ticket_eligibility_seed.sql"
run "$DIR/hall_ticket/hall_ticket_seed.sql"
echo "All seeders finished."

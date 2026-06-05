const fs = require('fs');
const path = require('path');

const moves = [
  ['src/features/institution/types.ts', 'src/types/institution.ts'],
  ['src/features/institution/schemas/institutionSchema.ts', 'src/schemas/institutionSchema.ts'],
  ['src/features/institution/components/forms/BasicDetailsFields.tsx', 'src/components/screens/BasicDetailsFields.tsx'],
  ['src/features/institution/components/forms/ContactDetailsFields.tsx', 'src/components/screens/ContactDetailsFields.tsx'],
  ['src/features/institution/components/forms/COEDetailsFields.tsx', 'src/components/screens/COEDetailsFields.tsx'],
  ['src/features/institution/components/modals/ActionConfirmModal.tsx', 'src/components/screens/ActionConfirmModal.tsx'],
  ['src/features/institution/components/modals/InstitutionFormModal.tsx', 'src/components/screens/InstitutionFormModal.tsx'],
  ['src/features/institution/components/InstitutionListView.tsx', 'src/components/screens/InstitutionListView.tsx'],
  ['src/features/institution/components/InstitutionTable.tsx', 'src/components/screens/InstitutionTable.tsx'],
  ['src/features/institution/components/InstitutionTabs.tsx', 'src/components/screens/InstitutionTabs.tsx'],
  ['src/features/institution/screens/AddInstitutionScreen.tsx', 'src/pages/AddInstitutionPage.tsx'],
  ['src/features/institution/screens/InstitutionListScreen.tsx', 'src/pages/InstitutionListPage.tsx']
];

moves.forEach(([src, dest]) => {
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
  }
});

const ifmPath = 'src/components/screens/InstitutionFormModal.tsx';
if (fs.existsSync(ifmPath)) {
  let content = fs.readFileSync(ifmPath, 'utf8');
  content = content.split('../forms/').join('./');
  fs.writeFileSync(ifmPath, content);
}

const aipPath = 'src/pages/AddInstitutionPage.tsx';
if (fs.existsSync(aipPath)) {
  let content = fs.readFileSync(aipPath, 'utf8');
  content = content.split('AddInstitutionScreen').join('AddInstitutionPage');
  content = content.split('../components/forms/').join('../components/screens/');
  content = content.split('../components/').join('../components/screens/');
  fs.writeFileSync(aipPath, content);
}

const ilpPath = 'src/pages/InstitutionListPage.tsx';
if (fs.existsSync(ilpPath)) {
  let content = fs.readFileSync(ilpPath, 'utf8');
  content = content.split('InstitutionListScreen').join('InstitutionListPage');
  content = content.split('../components/modals/').join('../components/screens/');
  content = content.split('../components/').join('../components/screens/');
  content = content.split('../types').join('../types/institution');
  fs.writeFileSync(ilpPath, content);
}

const appPath = 'src/App.tsx';
if (fs.existsSync(appPath)) {
  let content = fs.readFileSync(appPath, 'utf8');
  content = content.split('./features/institution/screens/InstitutionListScreen').join('./pages/InstitutionListPage');
  content = content.split('./features/institution/screens/AddInstitutionScreen').join('./pages/AddInstitutionPage');
  content = content.split('InstitutionListScreen').join('InstitutionListPage');
  content = content.split('AddInstitutionScreen').join('AddInstitutionPage');
  fs.writeFileSync(appPath, content);
}

console.log('Done!');

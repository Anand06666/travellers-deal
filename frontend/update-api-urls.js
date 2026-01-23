// Script to update all hardcoded localhost URLs to use API_URL from config
// This is a helper file - run manually if needed

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'src/pages/VendorRegister.jsx',
    'src/pages/VendorDashboard.jsx',
    'src/pages/UserProfile.jsx',
    'src/pages/Payment.jsx',
    'src/pages/ExperienceDetail.jsx',
    'src/pages/AdminVendorDetails.jsx',
    'src/pages/AdminExperienceDetails.jsx',
    'src/pages/AdminDashboard.jsx',
    'src/pages/AddExperience.jsx',
    'src/context/AuthContext.jsx',
    'src/components/ExperienceCard.jsx'
];

const importStatement = "import { API_URL } from '../config/api';";
const importStatementContext = "import { API_URL } from './config/api';";

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace all localhost URLs
        content = content.replace(/http:\/\/localhost:5000\/api/g, '${API_URL}');
        content = content.replace(/http:\/\/localhost:5000/g, '${API_URL.replace(\'/api\', \'\')}');

        // Add import if not present
        const isContextFile = file.includes('context');
        const importToAdd = isContextFile ? importStatementContext : importStatement;

        if (!content.includes("import { API_URL }")) {
            // Add import after other imports
            const importRegex = /(import .+ from .+;\n)+/;
            content = content.replace(importRegex, (match) => match + importToAdd + '\n');
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Updated ${file}`);
    } catch (error) {
        console.error(`✗ Error updating ${file}:`, error.message);
    }
});

console.log('\nAll files updated!');

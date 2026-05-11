const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/admin/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Add class to header
    content = content.replace(/<header\b([^>]*)style=\{\{([^}]+padding:\s*['"]32px 40px['"][^}]*)\}\}/g, '<header$1className="admin-header" style={{$2}}');
    content = content.replace(/<header\b([^>]*)style=\{\{([^}]+padding:\s*['"]32px['"][^}]*)\}\}/g, '<header$1className="admin-header" style={{$2}}');
    
    // Add class to body
    content = content.replace(/<div\b([^>]*)style=\{\{([^}]+padding:\s*['"]32px 40px['"][^}]*flex:\s*1[^}]*)\}\}/g, '<div$1className="admin-body" style={{$2}}');
    content = content.replace(/<div\b([^>]*)style=\{\{([^}]+flex:\s*1[^}]+padding:\s*['"]32px 40px['"][^}]*)\}\}/g, '<div$1className="admin-body" style={{$2}}');

    // For AdminBanners
    content = content.replace(/<div\b([^>]*)style=\{\{([^}]+padding:\s*['"]32px 40px['"][^}]*overflowY:\s*['"]auto['"][^}]*)\}\}/g, '<div$1className="admin-page-root" style={{$2}}');

    fs.writeFileSync(path.join(dir, file), content);
});

console.log("Done adding classes");

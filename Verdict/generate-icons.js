const { Jimp } = require('jimp');
const path = require('path');

const LOGO_PATH = path.join(__dirname, '../logo.jpeg');
const ANDROID_RES_PATH = path.join(__dirname, 'android/app/src/main/res');

const SIZES = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
};

async function generateIcons() {
    try {
        console.log(`Reading logo from: ${LOGO_PATH}`);
        // Jimp.read might be available on the Jimp class or as a static method
        const image = await Jimp.read(LOGO_PATH);

        for (const [folder, size] of Object.entries(SIZES)) {
            const outFolder = path.join(ANDROID_RES_PATH, folder);
            
            // Generate Square Icon
            const squareIcon = image.clone().resize({ w: size, h: size });
            const squarePath = path.join(outFolder, 'ic_launcher.png');
            await squareIcon.write(squarePath);
            console.log(`Generated: ${squarePath}`);

            // Generate Round Icon (Circle Mask)
            // Note: v1 might have different mask API. 
            // If circle() is not available directly, we skip or try a different way.
            // But usually resize is standard.
            // Check if circle method exists, if not, we might need a plugin or manual mask.
            // For now, let's just make the round icon same as square if circle fails or try to use it.
            
            try {
                 const roundIcon = image.clone().resize({ w: size, h: size });
                 if (roundIcon.circle) {
                    roundIcon.circle(); 
                 }
                 const roundPath = path.join(outFolder, 'ic_launcher_round.png');
                 await roundIcon.write(roundPath);
                 console.log(`Generated: ${roundPath}`);
            } catch (e) {
                console.log('Skipping round icon specific processing due to error:', e);
                // Fallback: just copy square
                 const roundPath = path.join(outFolder, 'ic_launcher_round.png');
                 await squareIcon.write(roundPath);
            }
        }

        console.log('All icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
        console.log('Jimp object keys:', Object.keys(require('jimp')));
    }
}

generateIcons();

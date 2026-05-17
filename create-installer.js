const electronInstaller = require('electron-winstaller');
const path = require('path');

async function createInstaller() {
  console.log('Starting professional Windows Setup compilation (Squirrel)...');
  try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: path.join(__dirname, 'dist', 'WhisperIsland-win32-x64'),
      outputDirectory: path.join(__dirname, 'dist', 'installers'),
      authors: 'Harkirat',
      exe: 'WhisperIsland.exe',
      setupExe: 'WhisperIslandSetup.exe',
      noMsi: true,
      description: 'Dynamic Island AI Dictation Capsule for Windows powered by Groq & Whisper'
    });
    console.log('\n==================================================================');
    console.log('🎉 SUCCESS: WhisperIslandSetup.exe has been compiled successfully!');
    console.log('📂 Location: dist/installers/WhisperIslandSetup.exe');
    console.log('==================================================================\n');
  } catch (e) {
    console.error(`\n❌ ERROR: Failed to create installer: ${e.message}\n`);
  }
}

createInstaller();

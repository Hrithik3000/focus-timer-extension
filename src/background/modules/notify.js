// src/background/modules/notify.js
export class Notifier{
  async done(phase){
    const title = phase==='work'? 'Focus complete! 🎉':'Break complete! ⏱️';
    try{ await chrome.notifications.create({ type:'basic', iconUrl:'assets/icons/icon48.png', title, message:'Starting next phase...' }); }catch{}
    try{ await this.sound('done'); }catch{}
  }
  async sound(name){
    // Use offscreen audio to play bundled sounds
    await chrome.offscreen.createDocument({ url:'src/offscreen/audio.html', reasons:[chrome.offscreen.Reason.AUDIO_PLAYBACK], justification:'Play timer sounds' }).catch(()=>{});
    await chrome.runtime.sendMessage({ type:'PLAY_SOUND', payload:{ name } }).catch(()=>{});
  }
}

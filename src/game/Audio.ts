export class Audio {
    public static play(type: 'pop' | 'thud'): void {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const t = ctx.currentTime;
            if (type === 'pop') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, t);
                osc.frequency.exponentialRampToValueAtTime(1100, t + 0.08);
                gain.gain.setValueAtTime(0.3, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
                osc.start(t); osc.stop(t + 0.12);
            } else {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(120, t);
                osc.frequency.linearRampToValueAtTime(40, t + 0.2);
                gain.gain.setValueAtTime(0.4, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
                osc.start(t); osc.stop(t + 0.25);
            }
            setTimeout(() => ctx.close(), 300);
        } catch (e) {
            console.warn(e);
        }
    }
}
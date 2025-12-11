import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Volume2, VolumeX, Play, Pause, 
  Cloud, Waves, Wind, Bird, Coffee, Flame
} from 'lucide-react';

interface SoundOption {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const sounds: SoundOption[] = [
  { id: 'rain', name: 'Rain', icon: Cloud, color: 'text-blue-400' },
  { id: 'ocean', name: 'Ocean', icon: Waves, color: 'text-cyan-400' },
  { id: 'wind', name: 'Wind', icon: Wind, color: 'text-slate-400' },
  { id: 'birds', name: 'Birds', icon: Bird, color: 'text-green-400' },
  { id: 'cafe', name: 'Café', icon: Coffee, color: 'text-amber-400' },
  { id: 'fire', name: 'Fire', icon: Flame, color: 'text-orange-400' },
];

// Create different noise types for more realistic sounds
const createPinkNoise = (context: AudioContext, duration: number): AudioBuffer => {
  const bufferSize = context.sampleRate * duration;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  
  return buffer;
};

const createBrownNoise = (context: AudioContext, duration: number): AudioBuffer => {
  const bufferSize = context.sampleRate * duration;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }
  
  return buffer;
};

export function AmbientSoundPlayer() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodesRef = useRef<AudioBufferSourceNode[]>([]);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const stopSound = () => {
    sourceNodesRef.current.forEach(node => {
      try { node.stop(); } catch {}
    });
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    sourceNodesRef.current = [];
    oscillatorsRef.current = [];
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  };

  const startSound = (soundId: string) => {
    stopSound();
    
    const context = new AudioContext();
    audioContextRef.current = context;
    
    const masterGain = context.createGain();
    masterGain.gain.value = volume / 100 * 0.4;
    masterGain.connect(context.destination);
    gainNodeRef.current = masterGain;

    switch (soundId) {
      case 'rain': {
        // Pink noise through lowpass for rain
        const rainBuffer = createPinkNoise(context, 4);
        const rainSource = context.createBufferSource();
        rainSource.buffer = rainBuffer;
        rainSource.loop = true;
        
        const lpf = context.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 2500;
        
        const hpf = context.createBiquadFilter();
        hpf.type = 'highpass';
        hpf.frequency.value = 200;
        
        rainSource.connect(lpf);
        lpf.connect(hpf);
        hpf.connect(masterGain);
        rainSource.start();
        sourceNodesRef.current.push(rainSource);
        
        // Add subtle drops effect
        const dropsBuffer = createPinkNoise(context, 2);
        const dropsSource = context.createBufferSource();
        dropsSource.buffer = dropsBuffer;
        dropsSource.loop = true;
        
        const dropFilter = context.createBiquadFilter();
        dropFilter.type = 'bandpass';
        dropFilter.frequency.value = 4000;
        dropFilter.Q.value = 2;
        
        const dropGain = context.createGain();
        dropGain.gain.value = 0.15;
        
        dropsSource.connect(dropFilter);
        dropFilter.connect(dropGain);
        dropGain.connect(masterGain);
        dropsSource.start();
        sourceNodesRef.current.push(dropsSource);
        break;
      }
      
      case 'ocean': {
        // Brown noise for deep ocean
        const oceanBuffer = createBrownNoise(context, 4);
        const oceanSource = context.createBufferSource();
        oceanSource.buffer = oceanBuffer;
        oceanSource.loop = true;
        
        const lpf = context.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 800;
        
        // LFO for wave modulation
        const lfo = context.createOscillator();
        lfo.frequency.value = 0.08;
        const lfoGain = context.createGain();
        lfoGain.gain.value = 0.25;
        lfo.connect(lfoGain);
        lfoGain.connect(masterGain.gain);
        lfo.start();
        oscillatorsRef.current.push(lfo);
        
        oceanSource.connect(lpf);
        lpf.connect(masterGain);
        oceanSource.start();
        sourceNodesRef.current.push(oceanSource);
        
        // Higher frequency for foam
        const foamBuffer = createPinkNoise(context, 3);
        const foamSource = context.createBufferSource();
        foamSource.buffer = foamBuffer;
        foamSource.loop = true;
        
        const foamFilter = context.createBiquadFilter();
        foamFilter.type = 'highpass';
        foamFilter.frequency.value = 1500;
        
        const foamGain = context.createGain();
        foamGain.gain.value = 0.1;
        
        foamSource.connect(foamFilter);
        foamFilter.connect(foamGain);
        foamGain.connect(masterGain);
        foamSource.start();
        sourceNodesRef.current.push(foamSource);
        break;
      }
      
      case 'wind': {
        // Filtered noise with slow modulation
        const windBuffer = createPinkNoise(context, 4);
        const windSource = context.createBufferSource();
        windSource.buffer = windBuffer;
        windSource.loop = true;
        
        const bpf = context.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = 600;
        bpf.Q.value = 0.8;
        
        // Slow modulation for gusts
        const lfo = context.createOscillator();
        lfo.frequency.value = 0.15;
        const lfoGain = context.createGain();
        lfoGain.gain.value = 300;
        lfo.connect(lfoGain);
        lfoGain.connect(bpf.frequency);
        lfo.start();
        oscillatorsRef.current.push(lfo);
        
        windSource.connect(bpf);
        bpf.connect(masterGain);
        windSource.start();
        sourceNodesRef.current.push(windSource);
        break;
      }
      
      case 'birds': {
        // Base nature ambience
        const baseBuffer = createPinkNoise(context, 3);
        const baseSource = context.createBufferSource();
        baseSource.buffer = baseBuffer;
        baseSource.loop = true;
        
        const baseLpf = context.createBiquadFilter();
        baseLpf.type = 'lowpass';
        baseLpf.frequency.value = 400;
        
        const baseGain = context.createGain();
        baseGain.gain.value = 0.15;
        
        baseSource.connect(baseLpf);
        baseLpf.connect(baseGain);
        baseGain.connect(masterGain);
        baseSource.start();
        sourceNodesRef.current.push(baseSource);
        
        // Bird chirps using oscillators
        const createChirp = (delay: number, freq: number) => {
          const osc = context.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = freq;
          
          const chirpGain = context.createGain();
          chirpGain.gain.value = 0;
          
          // Create chirp envelope
          const now = context.currentTime + delay;
          chirpGain.gain.setValueAtTime(0, now);
          chirpGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
          chirpGain.gain.linearRampToValueAtTime(0, now + 0.15);
          
          osc.connect(chirpGain);
          chirpGain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.2);
        };
        
        // Schedule random chirps
        const scheduleChirps = () => {
          if (!audioContextRef.current) return;
          for (let i = 0; i < 20; i++) {
            const delay = Math.random() * 8;
            const freq = 2000 + Math.random() * 2000;
            createChirp(delay, freq);
          }
          setTimeout(scheduleChirps, 8000);
        };
        scheduleChirps();
        break;
      }
      
      case 'cafe': {
        // Background chatter (filtered noise)
        const chatterBuffer = createPinkNoise(context, 4);
        const chatterSource = context.createBufferSource();
        chatterSource.buffer = chatterBuffer;
        chatterSource.loop = true;
        
        const bpf = context.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = 1000;
        bpf.Q.value = 1.5;
        
        // Subtle volume variation
        const lfo = context.createOscillator();
        lfo.frequency.value = 0.3;
        const lfoGain = context.createGain();
        lfoGain.gain.value = 0.1;
        lfo.connect(lfoGain);
        lfoGain.connect(masterGain.gain);
        lfo.start();
        oscillatorsRef.current.push(lfo);
        
        chatterSource.connect(bpf);
        bpf.connect(masterGain);
        chatterSource.start();
        sourceNodesRef.current.push(chatterSource);
        
        // Background music hint
        const musicBuffer = createPinkNoise(context, 2);
        const musicSource = context.createBufferSource();
        musicSource.buffer = musicBuffer;
        musicSource.loop = true;
        
        const musicLpf = context.createBiquadFilter();
        musicLpf.type = 'lowpass';
        musicLpf.frequency.value = 300;
        
        const musicGain = context.createGain();
        musicGain.gain.value = 0.2;
        
        musicSource.connect(musicLpf);
        musicLpf.connect(musicGain);
        musicGain.connect(masterGain);
        musicSource.start();
        sourceNodesRef.current.push(musicSource);
        break;
      }
      
      case 'fire': {
        // Crackling fire
        const fireBuffer = createBrownNoise(context, 3);
        const fireSource = context.createBufferSource();
        fireSource.buffer = fireBuffer;
        fireSource.loop = true;
        
        const lpf = context.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 1200;
        
        // Random crackle modulation
        const lfo = context.createOscillator();
        lfo.type = 'sawtooth';
        lfo.frequency.value = 8;
        const lfoGain = context.createGain();
        lfoGain.gain.value = 0.15;
        lfo.connect(lfoGain);
        lfoGain.connect(masterGain.gain);
        lfo.start();
        oscillatorsRef.current.push(lfo);
        
        fireSource.connect(lpf);
        lpf.connect(masterGain);
        fireSource.start();
        sourceNodesRef.current.push(fireSource);
        
        // High frequency crackles
        const crackleBuffer = createPinkNoise(context, 2);
        const crackleSource = context.createBufferSource();
        crackleSource.buffer = crackleBuffer;
        crackleSource.loop = true;
        
        const crackleHpf = context.createBiquadFilter();
        crackleHpf.type = 'highpass';
        crackleHpf.frequency.value = 3000;
        
        const crackleGain = context.createGain();
        crackleGain.gain.value = 0.08;
        
        crackleSource.connect(crackleHpf);
        crackleHpf.connect(crackleGain);
        crackleGain.connect(masterGain);
        crackleSource.start();
        sourceNodesRef.current.push(crackleSource);
        break;
      }
    }

    setActiveSound(soundId);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSound();
      setActiveSound(null);
    } else if (activeSound) {
      startSound(activeSound);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume / 100 * 0.4;
    }
  };

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  const activeSoundData = sounds.find(s => s.id === activeSound);

  return (
    <motion.div
      layout
      className="fixed bottom-6 left-6 z-40"
    >
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            <Card className="glass border-0 w-72">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Ambient Sounds</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {sounds.map((sound) => (
                    <motion.button
                      key={sound.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startSound(sound.id)}
                      className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                        activeSound === sound.id 
                          ? 'bg-primary/20 ring-2 ring-primary' 
                          : 'glass hover:bg-primary/10'
                      }`}
                    >
                      <sound.icon className={`w-5 h-5 ${sound.color}`} />
                      <span className="text-xs">{sound.name}</span>
                    </motion.button>
                  ))}
                </div>

                {activeSound && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlay}
                        className="h-10 w-10 p-0 rounded-full"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </Button>
                      <div className="flex-1 flex items-center gap-2">
                        <VolumeX className="w-4 h-4 text-muted-foreground" />
                        <Slider
                          value={[volume]}
                          onValueChange={handleVolumeChange}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className={`w-14 h-14 rounded-full glass flex items-center justify-center shadow-lg ${
              isPlaying ? 'ring-2 ring-primary' : ''
            }`}
          >
            {isPlaying && activeSoundData ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <activeSoundData.icon className={`w-6 h-6 ${activeSoundData.color}`} />
              </motion.div>
            ) : (
              <Volume2 className="w-6 h-6 text-muted-foreground" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

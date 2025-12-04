import React, { useState, useRef } from 'react';
import {
  Mic,
  Square,
  Play,
  Trash2,
  Loader2,
} from 'lucide-react';

const GravadorAudio = ({ onAudioAdicionado, onAudioRemovido }) => {
  const [gravando, setGravando] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [tempoGravacao, setTempoGravacao] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const iniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        stream.getTracks().forEach((track) => track.stop());
        
        if (onAudioAdicionado) {
          onAudioAdicionado(blob);
        }
      };

      mediaRecorder.start();
      setGravando(true);
      setTempoGravacao(0);

      timerRef.current = setInterval(() => {
        setTempoGravacao((prev) => prev + 1);
      }, 1000);
    } catch (erro) {
      console.error('Erro ao acessar microfone:', erro);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  const pararGravacao = () => {
    if (mediaRecorderRef.current && gravando) {
      mediaRecorderRef.current.stop();
      setGravando(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const removerAudio = () => {
    setAudioBlob(null);
    setTempoGravacao(0);
    if (onAudioRemovido) {
      onAudioRemovido();
    }
  };

  const formatarTempo = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const secs = segundos % 60;
    
    if (horas > 0) {
      return `${horas}:${minutos.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutos}:${secs.toString().padStart(2, '0')}`;
  };

  const reproduzirAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
    }
  };

  return (
    <div className="rounded-lg border transition" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-glass)' }}>
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Mic className="h-4 w-4" style={{ color: 'var(--accent)' }} />
          <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Gravar áudio (opcional)
          </label>
        </div>

        {!audioBlob ? (
          <div className="space-y-3">
            {!gravando ? (
              <button
                type="button"
                onClick={iniciarGravacao}
                className="btn-secondary w-full"
              >
                <Mic className="h-4 w-4 inline-block mr-2" />
                Iniciar gravação
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', borderWidth: '1px' }}>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      Gravando...
                    </span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-red-600 dark:text-red-400">
                    {formatarTempo(tempoGravacao)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={pararGravacao}
                  className="w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  <Square className="h-4 w-4 inline-block mr-2" />
                  Parar gravação
                </button>
              </div>
            )}
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Clique em "Iniciar gravação" e fale seus detalhes. Você poderá revisar antes de enviar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', borderWidth: '1px' }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  ✓ Áudio gravado ({formatarTempo(tempoGravacao)})
                </span>
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={reproduzirAudio}
                  className="w-full rounded-lg px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--teal)' }}
                >
                  <Play className="h-3 w-3 inline-block mr-2" />
                  Ouvir gravação
                </button>
                <button
                  type="button"
                  onClick={removerAudio}
                  className="btn-secondary w-full text-xs"
                >
                  <Trash2 className="h-3 w-3 inline-block mr-2" />
                  Remover áudio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GravadorAudio;

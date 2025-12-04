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
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Mic className="h-4 w-4 text-blue-600" />
        <label className="text-sm font-semibold text-slate-700">
          Gravar áudio (opcional)
        </label>
      </div>

      {!audioBlob ? (
        <div className="space-y-3">
          {!gravando ? (
            <button
              type="button"
              onClick={iniciarGravacao}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
            >
              <Mic className="h-4 w-4" />
              Iniciar gravação
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-red-700">
                    Gravando...
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold text-red-700">
                  {formatarTempo(tempoGravacao)}
                </span>
              </div>
              <button
                type="button"
                onClick={pararGravacao}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600"
              >
                <Square className="h-4 w-4" />
                Parar gravação
              </button>
            </div>
          )}
          <p className="text-xs text-slate-600">
            Clique em "Iniciar gravação" e fale seus detalhes. Você poderá revisar antes de enviar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg bg-emerald-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700">
                ✓ Áudio gravado ({formatarTempo(tempoGravacao)})
              </span>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={reproduzirAudio}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700"
              >
                <Play className="h-3 w-3" />
                Ouvir gravação
              </button>
              <button
                type="button"
                onClick={removerAudio}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3" />
                Remover áudio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GravadorAudio;

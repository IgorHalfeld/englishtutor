export function useAudioRecorder() {
  const audioChunks = ref<Blob[]>([])
  const audioWav = ref<Blob>()
  const speaking = ref<boolean>(false)
  const mediaRecorder = ref<MediaRecorder>()

  const record = async () => {
    speaking.value = true
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.value = new MediaRecorder(stream)
    mediaRecorder.value.start(1)

    mediaRecorder.value.addEventListener('dataavailable', (event) => {
      audioChunks.value.push(event.data)
    })
  }

  const stop = () => {
    mediaRecorder.value?.stop()
    speaking.value = false
  }
  const transformToWav = () => {
    const blob = new Blob(audioChunks.value, {
      type: 'audio/wav',
    })

    audioWav.value = blob
  }

  return {
    audioChunks,
    speaking,
    audioWav,
    mediaRecorder,
    transformToWav,
    record,
    stop,
  }
}

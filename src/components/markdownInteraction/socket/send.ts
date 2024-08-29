import { ref } from "vue";
import { ElMessage } from "element-plus";

export function SendToSIGEX() {

    const socket = ref<WebSocket | null | undefined>()

    const message = ref(
        {
            "platform": "SIGEX",
            "type": "web",
            "lab": "lab1",
            "cmd": "config",
            "data": {
                "tab": 5,
                "frequency": 1000,
                "duty cycle": 0.5,
                "SECTION 3: Signal Select ": false,
                "VARIABLE DC (V)": 0,
                "n": 1,
                "Signal select - Lab 6": 1,
                "Reference Amplitude": 1,
                "Shiftable Amplitude": 1,
                "phaseDAC1 (degrees)": 30,
                "phaseDAC0 (degrees)": 0,
                "set DAC0 to conjugate of DAC1": false,
                "Section 1.3 signals": false,
                "to DAC-0": false,
                "sine harmonic": 1,
                "sine phase (degrees)": 0,
                "COSINE AMPL.": [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                "SINE AMPL.": [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                "DC LEVEL -X5": 0,
                "1KHz + 2kHz": false,
                "VAR-DC_X13": 0,
                "a0": 1,
                "a1": 0,
                "a2": 0,
                "b0": 1,
                "b1": 0,
                "b2": 0,
                "D-OUT-0": false
            },
            "check": "sss"
        }
    )

    const webSocketInit = () => {
        console.log('aaaa')
        const wsUrl = 'ws://192.168.124.50:61234/'
        console.log(wsUrl)
        let newSocket = new WebSocket(wsUrl)
        newSocket.onopen = () => {
            socket.value = newSocket
            if (socket.value?.readyState === 1) {
                socket.value?.send(JSON.stringify(message.value))
            }
        }
        newSocket.onclose = () => {
            console.log("socket断连")
            // console.log(socket.value)
        }
        newSocket.onmessage = (message) => {
            console.log(message)
            console.log(message.data)
            console.log(JSON.parse(message.data))
        }
        newSocket.onerror = () => {
            ElMessage.error("连接设备错误")
            setTimeout(() => {
                webSocketInit();
            }, 4000)
        }
    }

}
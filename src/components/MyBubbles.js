import React from 'react'
import Particles from 'react-particles-js';

export default function MyBubbles() {
    return (
        <div style={{ height: "100%", width: "100%", position: "absolute" }}>
            <Particles
                height="110vh"
                width="100vw"
                params={{
                    "particles": {
                        "number": {
                            "value": 300,
                            "density": {
                                "enable": false
                            }
                        },
                        "size": {
                            "value": 3,
                            "random": true,
                            "anim": {
                                "speed": 4,
                                "size_min": 0.3
                            }
                        },
                        "line_linked": {
                            "enable": false
                        },
                        "move": {
                            "random": true,
                            "speed": 5,
                            "direction": "top",
                            "out_mode": "out"
                        }
                    },
                    "interactivity": {
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "bubble"
                            },
                            "onclick": {
                                "enable": false,
                                "mode": "repulse"
                            }
                        },
                        "modes": {
                            "bubble": {
                                "distance": 200,
                                "duration": 2,
                                "size": 0,
                                "opacity": 100
                            },
                            "repulse": {
                                "distance": 300,
                                "duration": 4
                            }
                        }
                    }
                }} />
        </div>
    )
}

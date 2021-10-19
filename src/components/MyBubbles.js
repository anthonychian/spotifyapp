import React from 'react'
import Particles from 'react-particles-js';

export default function MyBubbles() {
    return (
        <div style={{ height: "100vh", width: "100%"}}>
            <Particles
                style={{
                    minHeight: "800px",
                }}
                width="100vw"
                height="100vh"
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

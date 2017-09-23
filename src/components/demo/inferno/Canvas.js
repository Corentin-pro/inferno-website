import Inferno from 'inferno'
import Component from 'inferno-component'
import perfMonitor from '../system/perfMonitor'
import Emitter from '../system/Emitter'
import { Field, Vector, remove } from '../system/utils'
import { ParticleComponent } from './Elements'
import isPassive from '../../utils/isPassive'

const pool = []
const field = new Field([0, 0], -30)

export default class Canvas extends Component {
    constructor() {
        super()
        this.state = {
            mouse: [0, 0],
            particles: []
        }
    }
    componentDidMount() {
        const canvas = document.getElementById('demo-canvas')
        if (canvas) {
            canvas.addEventListener('mousemove', this.onMouseMove, isPassive)
            perfMonitor.startFPSMonitor()
            perfMonitor.startMemMonitor()
            perfMonitor.initProfiler('update')
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.paused !== this.props.paused) {
            window.requestAnimationFrame(this.loop)
        }
    }

    componentWillUnmount() {
        const canvas = document.getElementById('demo-canvas')
        canvas.removeEventListener('mousemove', this.onMouseMove, isPassive)
    }

    onMouseMove = (e) => {
        field.position[0] = e.offsetX
        field.position[1] = e.offsetY

        this.setState({
            mouse: [e.offsetX, e.offsetY]
        })
    }

    update = () => {
        const { lifetime, emissionRate } = this.props
        const { particles } = this.state

        // Emit particles
        for (let j = 0; j < emissionRate; j++) {
            particles.push(
                Emitter.emit(lifetime)
            )
        }

        // Update
        for (let i in particles) {
            let p = particles[i]
            p.lifetime += 1

            // If we're out of bounds, drop this particle and move on to the next
            if ((p.lifetime / p.lifetimeMax) > 0.6) {
                remove(particles, p)
                continue
            }

            Vector.submitToFields(p, field);
            Vector.update(p)
        }

        this.setState({
            particles
        })

        window.requestAnimationFrame(this.loop)
    }

    loop = () => {
        if (!this.props.paused) {
            perfMonitor.startProfile('update')
            this.update()
            perfMonitor.endProfile('update')
        }
    }

    render() {
        const { particles } = this.state
        return <div>
            <ParticleCounter count={particles.length}/>
            <ParticleWrapper items={particles} round={this.props.round}/>
        </div>
    }
}

class ParticleWrapper extends Component {
    render() {
        const { items, round } = this.props
        return <div id="demo-canvas" style={window.demo}>
            {items.map(data => (
                <ParticleComponent
                    x={data.position[0]|0}
                    y={data.position[1]|0}
                    lifetime={data.lifetime}
                    lifetimeMax={data.lifetimeMax}
                    round={round}
                />
            ))}
        </div>
    }
}

class ParticleCounter extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.count !== nextProps.count
    }
    render() {
        return <div className="demo-counter">
            Particles ({this.props.count})
        </div>
    }
}

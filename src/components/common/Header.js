import Inferno from 'inferno'
import Component from 'inferno-component'
import { Link } from 'inferno-router'
import IconMenu from '../icons/IconMenu'

export default class Header extends Component {
    constructor(props) {
        super(props)
        this.state = { active: false }
    }

    componentDidMount() {
        const main = document.querySelector('main')
        main.addEventListener('click', this.closeSidebar)
    }

    componentWillUnmount() {
        const main = document.querySelector('main')
        main.removeEventListener('click', this.closeSidebar)
    }

    closeSidebar = () => {
        this.setState({ active: false });
    }

    toggleSidebar = () => {
        this.setState({ active: !this.state.active });
    }

    render() {

        const MenuLink = (props) => {
            return <Link activeClassName="selected" {...props}>
                {props.children}
            </Link>
        }

        return (
        <div className="menu">
            <div className="menu-toggle" onClick={ this.toggleSidebar }>
                <IconMenu/>
            </div>
            <nav className={ this.state.active ? 'open' : 'closed' }>
                <MenuLink to="/">Home</MenuLink>
                <MenuLink to="/docs">Docs</MenuLink>
                <MenuLink to="/contribute">Contribute</MenuLink>
                <a target="_blank" href="https://github.com/trueadm/inferno/issues">Help</a>
            </nav>
        </div>
        )
    }
}
import Footer from '../../../../components/views/Footer';
import {LayoutProps} from '../../../layout';
import Header from '../../../../components/views/Header';


export default function Layout(props: LayoutProps) {
    return (<>
            <Header meta={}>Header</Header>
            <main style={{
                margin: `0 auto`,
                maxWidth: 960,
                padding: `0 1rem`,
            }}>
                {props.children}
            </main>
            <Footer/>
        </>
    )
}

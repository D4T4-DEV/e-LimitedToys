import './Contact.css'


const Contact: React.FC = () => {

    return (
        <>
            <div className="container-contact">
                <h1>Sobre nosotros</h1>
                <p>
                    Somos una empresa que vende juguetes de colección
                    estos siendo de las series, animes y medios favoritos.
                </p>
                <h2>Contáctanos</h2>
                <p><strong>Correo:</strong> elimitedtoys@gmail.com</p>
                <p><strong>Tel:</strong> +52 999 999 9999</p>

                <p><strong>Redes sociales:</strong></p>
                <div className='socials-container'>
                    <a href="https://facebook.com" className="link_social">Facebook</a>
                    <a href="https://twitter.com" className="link_social">Twitter</a>
                    <a href="https://instagram.com" className="link_social">Instagram</a>
                </div>
            </div>
        </>
    );
}

export default Contact;
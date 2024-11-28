import './Contact.css'


const Contact: React.FC = () => {

    return (
        <>
        <section id="contact" className="contact-info">
          <h2>Contacto</h2>
          <p>Si tienes alguna pregunta o duda sobre algún producto, por favor contáctanos.</p>
          <div className="contact-info">
            <p><strong>Correo electrónico:</strong> elimitedtoys@gmail.com</p>
            <p><strong>Teléfono:</strong> +52 999 999 9999</p>
            <p><strong>Dirección:</strong> Av. Ejemplo #123, Mérida Yucatán, México</p>
          </div>
          <form className="contact-form">
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" name="name" placeholder="Tu nombre" required />
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" name="email" placeholder="Tu correo electrónico" required />
            <label htmlFor="message">Mensaje</label>
            <textarea id="message" name="message" placeholder="Escribe tu mensaje aquí..." rows={4} required></textarea>
            <button type="submit">Enviar</button>
          </form>
        </section>
        </>
    );
}

export default Contact;
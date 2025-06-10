// src/components/ContactForm.js

import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { motion } from 'framer-motion';

const formAnimation = {
  initial: { opacity: 0, scale: 0.9, y: "-50%", x: "-50%" },
  animate: { opacity: 1, scale: 1, y: "-50%", x: "-50%" },
  exit: { opacity: 0, scale: 0.9, y: "-50%", x: "-50%" },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

function ContactForm({ onBack }) {
  const [state, handleSubmit] = useForm("xjkrylkj");

  if (state.succeeded) {
    return (
      <motion.div
        className="contact-container"
        variants={formAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={formAnimation.transition}
      >
        {/* Usiamo la classe 'close-button' per coerenza */}
        <button onClick={onBack} className="close-button">&times;</button>
        <h2>Thank you!</h2>
        <p>Your message has been sent successfully.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="contact-container"
      variants={formAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={formAnimation.transition}
    >
      {/* Usiamo la classe 'close-button' per coerenza */}
      <button onClick={onBack} className="close-button">&times;</button>
      <h2>get in touch</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" name="name" required />
          <ValidationError prefix="Name" field="name" errors={state.errors} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" name="email" required />
          <ValidationError prefix="Email" field="email" errors={state.errors} />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" required />
          <ValidationError prefix="Message" field="message" errors={state.errors} />
        </div>
        <button type="submit" disabled={state.submitting}>
          Send
        </button>
      </form>
    </motion.div>
  );
}

export default ContactForm;
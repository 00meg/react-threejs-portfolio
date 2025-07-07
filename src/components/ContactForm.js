// src/components/ContactForm.js
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import styled from 'styled-components';
import { ModalBackdrop, ModalContainer, CloseButton, modalAnimation, backdropAnimation } from '../styles/ModalStyles';
import HoverAnimatedText from './HoverAnimatedText';

const FormContainer = styled.div`
  margin-top: 1rem;
`;

const FormTitle = styled.h2`
  font-weight: 500;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.secondary};
  letter-spacing: -0.02em;
`;

const StyledForm = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 400;
  opacity: 0.8;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: inherit;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
    background-color: ${({ theme }) => theme.colors.hover};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
    opacity: 0.5;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.secondary};
  font-family: inherit;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
    background-color: ${({ theme }) => theme.colors.hover};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
    opacity: 0.5;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: transparent;
  border: 1px solid ${({ theme }) => `${theme.colors.secondary}60`};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1rem;
  font-weight: 400;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.secondary};
    font-weight: 700;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: transparent;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
`;

const SuccessText = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 1rem;
`;

function ContactForm({ onBack }) {
  const [state, handleSubmit] = useForm("xjkrylkj"); // Replace with your Formspree ID

  if (state.succeeded) {
    return (
      <ModalBackdrop
        variants={backdropAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={onBack}
      >
        <ModalContainer
          variants={modalAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onBack}>&times;</CloseButton>
          <SuccessMessage>
            <FormTitle>Thank You!</FormTitle>
            <SuccessText>Your message has been sent successfully. I'll get back to you soon.</SuccessText>
          </SuccessMessage>
        </ModalContainer>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop
      variants={backdropAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={onBack}
    >
      <ModalContainer
        variants={modalAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onBack}>&times;</CloseButton>
        <FormContainer>
          <FormTitle>Get in Touch</FormTitle>
          <StyledForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                type="text" 
                name="name" 
                placeholder="Your name"
                required 
              />
              <ValidationError prefix="Name" field="name" errors={state.errors} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                name="email" 
                placeholder="your.email@example.com"
                required 
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="Tell me about your project..."
                rows="5" 
                required 
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} />
            </FormGroup>
            <SubmitButton type="submit" disabled={state.submitting}>
              <HoverAnimatedText text={state.submitting ? 'Sending...' : 'Send Message'} />
            </SubmitButton>
          </StyledForm>
        </FormContainer>
      </ModalContainer>
    </ModalBackdrop>
  );
}

export default ContactForm;
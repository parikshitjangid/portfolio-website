import { useEffect, useRef, useState } from 'react'
import './Contact.css'

const initialForm = {
  name: '',
  email: '',
  message: '',
}

function ContactForm({ form, onChange, onSubmit, isSubmitting, status, idPrefix }) {
  return (
    <form className="contact__form" onSubmit={onSubmit}>
      <div className="contact__field">
        <label htmlFor={`${idPrefix}-name`}>Name</label>
        <input
          id={`${idPrefix}-name`}
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          value={form.name}
          onChange={onChange}
          maxLength={100}
          required
        />
      </div>

      <div className="contact__field">
        <label htmlFor={`${idPrefix}-email`}>Email</label>
        <input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange}
          maxLength={254}
          required
        />
      </div>

      <div className="contact__field">
        <label htmlFor={`${idPrefix}-message`}>Message</label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          placeholder="Tell me a little about what you have in mind..."
          rows={5}
          value={form.message}
          onChange={onChange}
          maxLength={5000}
          required
        />
      </div>

      <button
        className="contact__submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send message'}
        <span aria-hidden="true">↗</span>
      </button>

      {status.message && (
        <p
          className={`contact__status contact__status--${status.type}`}
          role="status"
        >
          {status.message}
        </p>
      )}
    </form>
  )
}

function Contact({ isOpen = false, onClose = () => {} }) {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const closeButtonRef = useRef(null)
  const previouslyFocusedRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedRef.current = document.activeElement
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key === 'Tab') {
        const dialog = document.querySelector('.contact-modal__dialog')
        const focusable = dialog?.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href]'
        )

        if (!focusable?.length) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''

      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus()
      }
    }
  }, [isOpen, onClose])

  function handleChange(event) {
    const { name, value } = event.target

    setForm(previous => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send your message.')
      }

      setForm(initialForm)
      setStatus({
        type: 'success',
        message: 'Message sent successfully. Thank you for reaching out!',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section className="contact" id="contact">
        <div className="contact__inner">
          <p className="contact__eyebrow">04 / GET IN TOUCH</p>

          <div className="contact__layout">
            <div className="contact__intro">
              <h2>
                Have an idea?
                <br />
                <span>Let's talk.</span>
              </h2>
              <p>
                Have a project in mind, a question, or an opportunity to
                collaborate? Send me a message.
              </p>
            </div>

            <ContactForm
              form={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              status={status}
              idPrefix="contact-inline"
            />
          </div>
        </div>
      </section>

      {isOpen && (
        <div
          className="contact-modal"
          onMouseDown={event => {
            if (event.target === event.currentTarget && !isSubmitting) {
              onClose()
            }
          }}
        >
          <section
            className="contact-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <button
              ref={closeButtonRef}
              className="contact-modal__close"
              type="button"
              aria-label="Close contact form"
              onClick={onClose}
            >
              ×
            </button>

            <p className="contact__eyebrow">04 / GET IN TOUCH</p>

            <div className="contact-modal__intro">
              <h2 id="contact-modal-title">
                Have an idea?
                <br />
                <span>Let's talk.</span>
              </h2>
              <p>
                Have a project in mind, a question, or an opportunity to
                collaborate? Send me a message.
              </p>
            </div>

            <ContactForm
              form={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              status={status}
              idPrefix="contact-modal"
            />
          </section>
        </div>
      )}
    </>
  )
}

export default Contact

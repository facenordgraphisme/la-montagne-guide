'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { contactErrors, questionError, type Answers, type AnswerValue, type Contact, type QQuestion, type QStep } from '@/lib/questionnaire'

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!

type Props = { id: string; slug: string; title: string; steps: QStep[]; confirmation: string }
type Status = 'idle' | 'sending' | 'success' | 'error' | 'closed'
type Errors = Record<string, string>

const INPUT = 'w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors text-foreground aria-[invalid=true]:border-red-400'
const LABEL = 'block text-sm font-bold text-foreground mb-2'
const EMPTY_CONTACT: Contact = { firstName: '', lastName: '', email: '', phone: '' }

export default function QuestionnaireForm({ id, slug, title, steps, confirmation }: Props) {
  const { language: lang } = useLanguage()
  const L = (fr: string, en: string) => (lang === 'en' ? en : fr)
  const pick = (fr?: string, en?: string) => (lang === 'en' && en ? en : fr || '')

  const storageKey = `lmg-questionnaire-${slug}`
  const [step, setStep] = useState(0) // 0 = contact details, then one per Sanity step
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT)
  const [answers, setAnswers] = useState<Answers>({})
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [restored, setRestored] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const total = steps.length + 1
  const isLast = step === total - 1

  // Unsent answers survive a closed tab: restore after hydration (localStorage is browser-only), then save on every change
  useEffect(() => {
    let saved: { contact?: Partial<Contact>; answers?: Answers } | null = null
    try { saved = JSON.parse(localStorage.getItem(storageKey) || 'null') } catch {}
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from browser storage */
    if (saved?.contact) setContact({ ...EMPTY_CONTACT, ...saved.contact })
    if (saved?.answers) setAnswers(saved.answers)
    setRestored(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [storageKey])

  useEffect(() => {
    if (!restored || status === 'success') return
    try {
      localStorage.setItem(storageKey, JSON.stringify({ contact, answers }))
    } catch {}
  }, [contact, answers, restored, status, storageKey])

  const goTo = (next: number) => {
    setStep(next)
    setErrors({})
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const validateStep = (): Errors => {
    if (step === 0) return contactErrors(contact, lang) as Errors
    const errs: Errors = {}
    for (const q of steps[step - 1].questions || []) {
      const e = questionError(q, answers[q._key], lang)
      if (e) errs[q._key] = e
    }
    return errs
  }

  const setAnswer = (key: string, value: AnswerValue) => {
    setAnswers((a) => ({ ...a, [key]: value }))
    if (errors[key]) setErrors((errs) => Object.fromEntries(Object.entries(errs).filter(([k]) => k !== key)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateStep()
    if (Object.keys(errs).length) {
      setErrors(errs)
      document.getElementById(`q-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    if (!isLast) return goTo(step + 1)

    setStatus('sending')
    try {
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionnaireId: id, lang, contact, answers, website: honeypotRef.current?.value || '' }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 410) return setStatus('closed')
      if (!res.ok) throw new Error(data?.error || 'error')

      // Email notification with the contact form's template; the response is already saved in Sanity
      if (data.summary) {
        const name = `${contact.firstName} ${contact.lastName}`.trim()
        await emailjs
          .send(SERVICE_ID, TEMPLATE_ID, {
            name,
            first_name: contact.firstName,
            last_name: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            message: data.summary,
            subject: `Questionnaire : ${title}`,
          }, { publicKey: PUBLIC_KEY })
          .catch(() => {})
      }

      try { localStorage.removeItem(storageKey) } catch {}
      setStatus('success')
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success' || status === 'closed') {
    return (
      <div ref={topRef} className="glass rounded-[32px] p-8 md:p-12 flex flex-col items-center text-center gap-4 scroll-mt-32">
        {status === 'success' ? <CheckCircle size={48} className="text-accent" /> : <AlertCircle size={48} className="text-accent" />}
        <p className="text-lg text-foreground/80 whitespace-pre-line">
          {status === 'success' ? confirmation : L('Les inscriptions pour ce questionnaire viennent de fermer.', 'Registration for this form has just closed.')}
        </p>
      </div>
    )
  }

  const stepTitle = step === 0 ? L('Vos coordonnées', 'Your details') : pick(steps[step - 1].title, steps[step - 1].titleEn)
  const progress = ((step + 1) / total) * 100

  return (
    <div ref={topRef} className="glass rounded-[32px] p-6 md:p-10 scroll-mt-32">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="text-xs font-black uppercase tracking-widest text-accent">
            {L('Étape', 'Step')} {step + 1} / {total}
          </p>
        </div>
        <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1}>
          <motion.div className="h-full bg-accent rounded-full" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot, hidden from people */}
        <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.fieldset
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="space-y-7"
          >
            <legend className="text-2xl md:text-3xl font-bold tracking-tight mb-6">{stepTitle}</legend>

            {step === 0 ? (
              <ContactStep contact={contact} setContact={(c) => { setContact(c); setErrors({}) }} errors={errors} L={L} />
            ) : (
              (steps[step - 1].questions || []).map((q) => (
                <Question key={q._key} q={q} value={answers[q._key]} error={errors[q._key]} onChange={(v) => setAnswer(q._key, v)} pick={pick} L={L} />
              ))
            )}
          </motion.fieldset>
        </AnimatePresence>

        {status === 'error' && (
          <p className="mt-6 flex items-start gap-2 text-sm text-red-500" role="alert">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            {L(
              "L'envoi n'a pas abouti. Vos réponses sont conservées : réessayez dans un instant, ou contactez-moi directement.",
              "Sending failed. Your answers are kept: please try again in a moment, or contact me directly."
            )}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors py-3">
              <ArrowLeft size={16} /> {L('Retour', 'Back')}
            </button>
          ) : <span />}
          <button type="submit" disabled={status === 'sending'} className="btn-primary !text-white inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest !py-4 !px-7 disabled:opacity-60">
            {status === 'sending' ? (
              <><Loader2 size={16} className="animate-spin" /> {L('Envoi…', 'Sending…')}</>
            ) : isLast ? (
              <><Send size={16} /> {L('Envoyer', 'Send')}</>
            ) : (
              <>{L('Continuer', 'Next')} <ArrowRight size={16} /></>
            )}
          </button>
        </div>
        {step === 0 && (
          <p className="mt-6 text-xs text-foreground/50 !text-left">
            {L(
              'Vos réponses sont utilisées uniquement pour organiser votre sortie. Elles sont gardées sur cet appareil tant que vous n’avez pas envoyé le questionnaire.',
              'Your answers are only used to organise your trip. They are kept on this device until you send the form.'
            )}
          </p>
        )}
      </form>
    </div>
  )
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null
  return <p id={`${id}-error`} className="mt-2 text-sm text-red-500">{error}</p>
}

function ContactStep({ contact, setContact, errors, L }: { contact: Contact; setContact: (c: Contact) => void; errors: Errors; L: (fr: string, en: string) => string }) {
  const field = (key: keyof Contact, label: string, type: string, autoComplete: string, required = true) => (
    <div>
      <label htmlFor={`q-${key}`} className={LABEL}>
        {label} {required ? <span className="text-accent">*</span> : <span className="font-normal text-foreground/50">({L('facultatif', 'optional')})</span>}
      </label>
      <input
        id={`q-${key}`}
        type={type}
        value={contact[key]}
        onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
        autoComplete={autoComplete}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `q-${key}-error` : undefined}
        className={INPUT}
      />
      <FieldError id={`q-${key}`} error={errors[key]} />
    </div>
  )
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-4">
        {field('firstName', L('Prénom', 'First name'), 'text', 'given-name')}
        {field('lastName', L('Nom', 'Last name'), 'text', 'family-name')}
      </div>
      {field('email', L('E-mail', 'Email'), 'email', 'email')}
      {field('phone', L('Téléphone', 'Phone'), 'tel', 'tel', false)}
    </>
  )
}

function Question({ q, value, error, onChange, pick, L }: {
  q: QQuestion
  value: AnswerValue | undefined
  error?: string
  onChange: (v: AnswerValue) => void
  pick: (fr?: string, en?: string) => string
  L: (fr: string, en: string) => string
}) {
  const id = `q-${q._key}`
  const label = pick(q.label, q.labelEn)
  const help = pick(q.help, q.helpEn)
  const describedBy = [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  const mark = q.required ? <span className="text-accent">*</span> : <span className="font-normal text-foreground/50">({L('facultatif', 'optional')})</span>
  const helpText = help ? <p id={`${id}-help`} className="text-sm text-foreground/55 -mt-1 mb-3 !text-left">{help}</p> : null

  // Choice questions: a group of large tappable options
  if (q.kind === 'single' || q.kind === 'multiple' || q.kind === 'yesno') {
    const options = q.kind === 'yesno'
      ? [{ key: 'yes', text: L('Oui', 'Yes') }, { key: 'no', text: L('Non', 'No') }]
      : (q.options || []).map((o) => ({ key: o._key, text: pick(o.label, o.labelEn) }))
    const multiple = q.kind === 'multiple'
    const selected = new Set(Array.isArray(value) ? value : value ? [value] : [])
    const toggle = (key: string) => {
      if (!multiple) return onChange(key)
      const next = new Set(selected)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      onChange(options.map((o) => o.key).filter((k) => next.has(k)))
    }
    return (
      <div role={multiple ? 'group' : 'radiogroup'} aria-labelledby={`${id}-label`} aria-describedby={describedBy} aria-invalid={!!error}>
        <p id={`${id}-label`} className={LABEL}>{label} {mark}</p>
        {helpText}
        {multiple && <p className="text-xs text-foreground/50 -mt-1 mb-3">{L('Plusieurs réponses possibles', 'Select all that apply')}</p>}
        <div className={q.kind === 'yesno' ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'}>
          {options.map((o, i) => {
            const checked = selected.has(o.key)
            return (
              <label
                key={o.key}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors select-none ${checked ? 'border-accent bg-accent/10' : 'border-foreground/10 bg-foreground/5 hover:border-foreground/30'} has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent`}
              >
                <input
                  id={i === 0 ? id : undefined}
                  type={multiple ? 'checkbox' : 'radio'}
                  name={id}
                  checked={checked}
                  onChange={() => toggle(o.key)}
                  className="sr-only"
                />
                <span aria-hidden className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 ${multiple ? 'rounded-md' : 'rounded-full'} ${checked ? 'border-accent bg-accent' : 'border-foreground/30'}`}>
                  {checked && <span className={multiple ? 'text-[11px] font-black text-white leading-none' : 'h-2 w-2 rounded-full bg-white'}>{multiple ? '✓' : ''}</span>}
                </span>
                <span className="font-medium text-foreground">{o.text}</span>
              </label>
            )
          })}
        </div>
        <FieldError id={id} error={error} />
      </div>
    )
  }

  const common = {
    id,
    value: typeof value === 'string' ? value : '',
    'aria-invalid': !!error,
    'aria-describedby': describedBy,
    className: INPUT,
  }

  return (
    <div>
      <label htmlFor={id} className={LABEL}>{label} {mark}</label>
      {helpText}
      {q.kind === 'long' ? (
        <textarea {...common} rows={4} onChange={(e) => onChange(e.target.value)} className={`${INPUT} resize-y`} />
      ) : q.kind === 'number' ? (
        <input {...common} type="text" inputMode="decimal" onChange={(e) => onChange(e.target.value)} className={`${INPUT} max-w-[12rem]`} />
      ) : q.kind === 'date' ? (
        <input {...common} type="date" onChange={(e) => onChange(e.target.value)} className={`${INPUT} max-w-[14rem]`} />
      ) : (
        <input {...common} type="text" onChange={(e) => onChange(e.target.value)} />
      )}
      <FieldError id={id} error={error} />
    </div>
  )
}

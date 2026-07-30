'use client'

import React, { useState } from 'react'
import { Star, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface Comment {
  _id: string
  name: string
  rating: number
  content: string
  _createdAt: string
}

interface PostCommentsProps {
  postId: string
  initialComments: Comment[]
}

export default function PostComments({ postId, initialComments }: PostCommentsProps) {
  const { language, at } = useLanguage()
  const [comments, setComments] = useState<Comment[]>(initialComments || [])
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [passcode, setPasscode] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const t = {
    fr: {
      title: 'Témoignages Clients',
      subtitle: 'Partagez votre expérience de cette aventure. Accès réservé aux participants.',
      namePlaceholder: 'Votre nom',
      codePlaceholder: 'Code d\'accès client',
      commentPlaceholder: 'Racontez votre souvenir, votre ressenti, l\'ambiance...',
      submit: 'Envoyer mon témoignage',
      submitting: 'Envoi en cours...',
      successMsg: 'Merci ! Votre témoignage a été soumis avec succès. Il sera visible dès sa validation.',
      stars: 'Note',
      noComments: 'Aucun témoignage pour le moment. Vous avez fait cette course ? Laissez votre avis !',
      datePrefix: 'Le'
    },
    en: {
      title: 'Client Testimonials',
      subtitle: 'Share your experience of this adventure. Access restricted to participants.',
      namePlaceholder: 'Your name',
      codePlaceholder: 'Client passcode',
      commentPlaceholder: 'Describe your memories, feelings, the atmosphere...',
      submit: 'Submit my review',
      submitting: 'Submitting...',
      successMsg: 'Thank you! Your testimonial has been submitted successfully and will be visible after moderation.',
      stars: 'Rating',
      noComments: 'No testimonials yet. Did you join this outing? Leave your review!',
      datePrefix: 'On'
    }
  }[language === 'en' ? 'en' : 'fr']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          name,
          rating,
          content,
          passcode
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue.')
      }

      setSuccess(true)
      setName('')
      setContent('')
      setPasscode('')
      setRating(5)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-20 pt-16 border-t border-border/40 space-y-12">
      {/* Comments List */}
      <div>
        <h3 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
          <MessageSquare className="text-accent" />
          {t.title} ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <p className="text-foreground/50 text-sm italic">{t.noComments}</p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="p-6 md:p-8 rounded-3xl bg-foreground/[0.02] border border-border/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-bold text-foreground/95 block text-lg">{comment.name}</span>
                    <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                      {t.datePrefix} {new Date(comment._createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex gap-0.5 text-highlight">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={star <= comment.rating ? 'currentColor' : 'none'}
                        className={star <= comment.rating ? 'text-highlight' : 'text-foreground/10'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-foreground/75 leading-relaxed text-sm whitespace-pre-line">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form */}
      <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-border shadow-xl bg-card/5">
        <h4 className="text-xl font-black uppercase tracking-tight mb-2">{language === 'en' ? 'Write a review' : 'Laisser un témoignage'}</h4>
        <p className="text-xs text-foreground/50 mb-8 leading-relaxed">{t.subtitle}</p>

        {success ? (
          <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 flex gap-3 items-center">
            <CheckCircle2 size={24} className="flex-shrink-0" />
            <span className="font-bold text-sm leading-relaxed">{t.successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex gap-2.5 items-center text-sm font-bold">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">{t.namePlaceholder}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full px-5 py-3.5 rounded-2xl bg-foreground/5 border border-border focus:border-accent outline-none text-sm transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">{t.codePlaceholder}</label>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={t.codePlaceholder}
                  className="w-full px-5 py-3.5 rounded-2xl bg-foreground/5 border border-border focus:border-accent outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/60 block">{t.stars}</label>
              <div className="flex gap-1 text-foreground/20">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform text-highlight"
                  >
                    <Star
                      size={24}
                      fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'}
                      className={star <= (hoverRating || rating) ? 'text-highlight' : 'text-foreground/10'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/60 block">{language === 'en' ? 'Your message' : 'Votre message'}</label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t.commentPlaceholder}
                className="w-full px-5 py-4 rounded-2xl bg-foreground/5 border border-border focus:border-accent outline-none text-sm transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.submitting}
                </>
              ) : (
                <>
                  <Send size={14} />
                  {t.submit}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

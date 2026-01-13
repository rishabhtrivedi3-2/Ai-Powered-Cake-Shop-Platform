'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton' // npx shadcn@latest add skeleton
import { Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AICakePage () {
  const [prompt, setPrompt] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function generateAICake () {
    setLoading(true)
    setImage(null) // Reset image to show loading state
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      setImage(data.image || data.imageUrl)
    } finally {
      setLoading(false)
    }
  }
  async function submitRequest () {
    await fetch('/api/custom-cakes', {
      method: 'POST',

      body: JSON.stringify({
        prompt,

        expectedPrice: Number(price),

        aiImage: image
      })
    })

    setOpen(false) // Close dialog on success
  }
  return (
    <div className='flex items-center justify-center min-h-screen'>
      {/* Full Screen AI Glow - only visible when loading */}
      <div
        className={cn(
          'fixed inset-0 pointer-events-none z-[60] transition-opacity duration-500 rounded-none',
          loading
            ? 'opacity-100 animate-siri-glow border-[6px] border-purple-500/20'
            : 'opacity-0'
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='gap-2'>
            <Sparkles className='w-4 h-4' /> Design Custom Cake
          </Button>
        </DialogTrigger>

        <DialogContent className='w-full h-full overflow-y-auto sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Design Your Cake 🎂</DialogTitle>
            <DialogDescription>
              Describe your dream cake for an AI preview.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label>Cake Description</Label>
              <Textarea
                placeholder='e.g. A 3-tier chocolate cake...'
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label>Your Budget (₹)</Label>
              <Input
                type='number'
                placeholder='5000'
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>

            <Button
              variant='secondary'
              onClick={generateAICake}
              disabled={loading || !prompt}
            >
              {loading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Sparkles className='mr-2 h-4 w-4' />
              )}
              {image ? 'Regenerate' : 'Generate Preview'}
            </Button>

            {/* PREVIEW CONTAINER - Keep height same using aspect-video */}
            <div className='relative aspect-video w-full rounded-md border bg-muted overflow-hidden'>
              {loading && (
                <div className='absolute inset-0 z-10'>
                  <Skeleton className='h-full w-full' />
                  <div className='absolute inset-0 flex items-center justify-center text-muted-foreground animate-pulse'>
                    <Sparkles className='h-8 w-8 mr-2' />
                    <span>AI is baking...</span>
                  </div>
                </div>
              )}
              {image ? (
                <img
                  src={image}
                  alt='AI Preview'
                  className='h-full w-full object-cover transition-opacity duration-500 overflow-y-auto'
                />
              ) : (
                !loading && (
                  <div className='flex items-center justify-center h-full text-sm text-muted-foreground'>
                    Preview will appear here
                  </div>
                )
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={submitRequest}
              className='w-full'
              disabled={!image || !price}
            >
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

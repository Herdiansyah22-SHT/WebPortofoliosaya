import { Link } from 'react-router-dom'
import { BlogCard } from '../blog/BlogCard'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Reveal } from '../../components/common/Reveal'
import { Button } from '../../components/ui'

export function BlogSection({ posts }) {
  if (!posts?.length) return null

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <Reveal>
        <SectionHeading eyebrow="Blog" title="Tulisan terbaru" description="Catatan dan pembelajaran seputar pengembangan web." />
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post, i) => (
          <Reveal key={post.id} delay={i * 100}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 text-center" delay={120}>
        <Link to="/blog">
          <Button variant="secondary" size="lg">Lihat semua tulisan</Button>
        </Link>
      </Reveal>
    </section>
  )
}

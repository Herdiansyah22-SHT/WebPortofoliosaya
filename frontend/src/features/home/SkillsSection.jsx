import { SectionHeading } from '../../components/common/SectionHeading'
import { Reveal } from '../../components/common/Reveal'
import { SkillMatrix } from '../skills/SkillMatrix'

export function SkillsSection({ skills }) {
  if (!skills?.length) return null

  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading
            eyebrow="Skills"
            title="Keahlian"
            description="Kemampuan utama yang saya gunakan untuk membangun web."
          />
        </Reveal>

        <div className="mt-12">
          <SkillMatrix skills={skills} />
        </div>
      </div>
    </section>
  )
}
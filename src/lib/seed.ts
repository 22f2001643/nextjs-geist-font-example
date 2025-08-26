import { PrismaClient, JobType } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.job.deleteMany()

  // Create sample jobs
  const jobs = [
    {
      jobTitle: 'Full Stack Developer',
      companyName: 'Tech Corp',
      location: 'San Francisco, CA',
      jobType: JobType.FULL_TIME,
      salaryRange: '$80,000 - $120,000',
      jobDescription: 'We are looking for a talented Full Stack Developer to join our team. You will be responsible for developing and maintaining web applications using modern technologies.',
      requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience with React, Node.js, and databases. Strong problem-solving skills.',
      responsibilities: 'Develop and maintain web applications. Collaborate with cross-functional teams. Write clean, maintainable code. Participate in code reviews.',
      applicationDeadline: new Date('2024-12-31')
    },
    {
      jobTitle: 'UX/UI Designer',
      companyName: 'Design Studio',
      location: 'New York, NY',
      jobType: JobType.FULL_TIME,
      salaryRange: '$70,000 - $100,000',
      jobDescription: 'Join our creative team as a UX/UI Designer. You will create intuitive and engaging user experiences for our digital products.',
      requirements: 'Bachelor\'s degree in Design or related field. 2+ years of experience with Figma, Sketch, or Adobe Creative Suite. Portfolio required.',
      responsibilities: 'Create wireframes and prototypes. Conduct user research. Design user interfaces. Collaborate with developers.',
      applicationDeadline: new Date('2024-11-30')
    },
    {
      jobTitle: 'Marketing Intern',
      companyName: 'StartUp Inc',
      location: 'Austin, TX',
      jobType: JobType.INTERNSHIP,
      salaryRange: '$15 - $20 per hour',
      jobDescription: 'Great opportunity for a marketing student to gain hands-on experience in digital marketing and social media management.',
      requirements: 'Currently enrolled in Marketing, Communications, or related program. Basic knowledge of social media platforms. Excellent communication skills.',
      responsibilities: 'Assist with social media campaigns. Create marketing content. Analyze campaign performance. Support marketing team initiatives.',
      applicationDeadline: new Date('2024-10-15')
    },
    {
      jobTitle: 'DevOps Engineer',
      companyName: 'Cloud Solutions',
      location: 'Seattle, WA',
      jobType: JobType.CONTRACT,
      salaryRange: '$90,000 - $130,000',
      jobDescription: 'We need an experienced DevOps Engineer to help us scale our cloud infrastructure and improve our deployment processes.',
      requirements: '5+ years of experience with AWS/Azure. Experience with Docker, Kubernetes, and CI/CD pipelines. Strong scripting skills.',
      responsibilities: 'Manage cloud infrastructure. Implement CI/CD pipelines. Monitor system performance. Ensure security best practices.',
      applicationDeadline: new Date('2024-12-15')
    }
  ]

  for (const job of jobs) {
    await prisma.job.create({
      data: job
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

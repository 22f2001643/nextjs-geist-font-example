import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { JobType } from '@/generated/prisma'

// GET /api/jobs - Get all jobs with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobTitle = searchParams.get('jobTitle')
    const location = searchParams.get('location')
    const jobType = searchParams.get('jobType')
    const minSalary = searchParams.get('minSalary')
    const maxSalary = searchParams.get('maxSalary')

    const where: any = {}

    if (jobTitle) {
      where.jobTitle = {
        contains: jobTitle,
        mode: 'insensitive'
      }
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      }
    }

    if (jobType && Object.values(JobType).includes(jobType as JobType)) {
      where.jobType = jobType as JobType
    }

    // For salary filtering, we'll do a simple string contains search
    // In a real app, you'd want to store salary as numbers
    if (minSalary || maxSalary) {
      where.salaryRange = {
        contains: minSalary || maxSalary,
        mode: 'insensitive'
      }
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      jobTitle,
      companyName,
      location,
      jobType,
      salaryRange,
      jobDescription,
      requirements,
      responsibilities,
      applicationDeadline
    } = body

    // Validate required fields
    if (!jobTitle || !companyName || !location || !jobType || !salaryRange || 
        !jobDescription || !requirements || !responsibilities || !applicationDeadline) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate jobType
    if (!Object.values(JobType).includes(jobType)) {
      return NextResponse.json(
        { error: 'Invalid job type' },
        { status: 400 }
      )
    }

    const job = await prisma.job.create({
      data: {
        jobTitle,
        companyName,
        location,
        jobType: jobType as JobType,
        salaryRange,
        jobDescription,
        requirements,
        responsibilities,
        applicationDeadline: new Date(applicationDeadline)
      }
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}

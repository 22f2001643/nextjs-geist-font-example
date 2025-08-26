import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { JobType } from '@/generated/prisma'

// GET /api/jobs/[id] - Get a specific job by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: params.id
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

// PUT /api/jobs/[id] - Update a specific job by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Validate jobType if provided
    if (jobType && !Object.values(JobType).includes(jobType)) {
      return NextResponse.json(
        { error: 'Invalid job type' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (jobTitle) updateData.jobTitle = jobTitle
    if (companyName) updateData.companyName = companyName
    if (location) updateData.location = location
    if (jobType) updateData.jobType = jobType as JobType
    if (salaryRange) updateData.salaryRange = salaryRange
    if (jobDescription) updateData.jobDescription = jobDescription
    if (requirements) updateData.requirements = requirements
    if (responsibilities) updateData.responsibilities = responsibilities
    if (applicationDeadline) updateData.applicationDeadline = new Date(applicationDeadline)

    const job = await prisma.job.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

// DELETE /api/jobs/[id] - Delete a specific job by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    await prisma.job.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Job deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}

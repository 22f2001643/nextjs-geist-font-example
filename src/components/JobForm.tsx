'use client'

import { useState, useEffect } from 'react'
import {
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Stack
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'

interface Job {
  id: string
  jobTitle: string
  companyName: string
  location: string
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'
  salaryRange: string
  jobDescription: string
  requirements: string
  responsibilities: string
  applicationDeadline: string
  createdAt: string
  updatedAt: string
}

interface JobFormProps {
  job?: Job | null
  onSave: () => void
  onCancel: () => void
}

export default function JobForm({ job, onSave, onCancel }: JobFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      jobTitle: '',
      companyName: '',
      location: '',
      jobType: '',
      salaryRange: '',
      jobDescription: '',
      requirements: '',
      responsibilities: '',
      applicationDeadline: new Date()
    },
    validate: {
      jobTitle: (value: string) => (!value ? 'Job title is required' : null),
      companyName: (value: string) => (!value ? 'Company name is required' : null),
      location: (value: string) => (!value ? 'Location is required' : null),
      jobType: (value: string) => (!value ? 'Job type is required' : null),
      salaryRange: (value: string) => (!value ? 'Salary range is required' : null),
      jobDescription: (value: string) => (!value ? 'Job description is required' : null),
      requirements: (value: string) => (!value ? 'Requirements are required' : null),
      responsibilities: (value: string) => (!value ? 'Responsibilities are required' : null),
      applicationDeadline: (value: Date | null) => (!value ? 'Application deadline is required' : null)
    }
  })

  useEffect(() => {
    if (job) {
      form.setValues({
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        location: job.location,
        jobType: job.jobType,
        salaryRange: job.salaryRange,
        jobDescription: job.jobDescription,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        applicationDeadline: new Date(job.applicationDeadline)
      })
    } else {
      form.reset()
    }
  }, [job])

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)
    
    try {
      const url = job ? `/api/jobs/${job.id}` : '/api/jobs'
      const method = job ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...values,
          applicationDeadline: values.applicationDeadline.toISOString()
        })
      })

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: `Job ${job ? 'updated' : 'created'} successfully`,
          color: 'green'
        })
        onSave()
      } else {
        const error = await response.json()
        notifications.show({
          title: 'Error',
          message: error.error || `Failed to ${job ? 'update' : 'create'} job`,
          color: 'red'
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to ${job ? 'update' : 'create'} job`,
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Job Title"
          placeholder="Enter job title"
          required
          {...form.getInputProps('jobTitle')}
        />

        <TextInput
          label="Company Name"
          placeholder="Enter company name"
          required
          {...form.getInputProps('companyName')}
        />

        <TextInput
          label="Location"
          placeholder="Enter location"
          required
          {...form.getInputProps('location')}
        />

        <Select
          label="Job Type"
          placeholder="Select job type"
          required
          data={[
            { value: 'FULL_TIME', label: 'Full-time' },
            { value: 'PART_TIME', label: 'Part-time' },
            { value: 'CONTRACT', label: 'Contract' },
            { value: 'INTERNSHIP', label: 'Internship' }
          ]}
          {...form.getInputProps('jobType')}
        />

        <TextInput
          label="Salary Range"
          placeholder="e.g., $50,000 - $70,000"
          required
          {...form.getInputProps('salaryRange')}
        />

        <Textarea
          label="Job Description"
          placeholder="Enter job description"
          required
          minRows={4}
          {...form.getInputProps('jobDescription')}
        />

        <Textarea
          label="Requirements"
          placeholder="Enter job requirements"
          required
          minRows={3}
          {...form.getInputProps('requirements')}
        />

        <Textarea
          label="Responsibilities"
          placeholder="Enter job responsibilities"
          required
          minRows={3}
          {...form.getInputProps('responsibilities')}
        />

        <DateInput
          label="Application Deadline"
          placeholder="Select deadline date"
          required
          {...form.getInputProps('applicationDeadline')}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {job ? 'Update Job' : 'Create Job'}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

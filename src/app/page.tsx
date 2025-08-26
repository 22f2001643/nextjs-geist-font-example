'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Title,
  Button,
  Group,
  Card,
  Text,
  Badge,
  Grid,
  TextInput,
  Select,
  RangeSlider,
  Stack,
  Flex,
  ActionIcon,
  Modal,
  Loader,
  Center
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconPlus, IconEdit, IconTrash, IconSearch } from '@tabler/icons-react'
import JobForm from '@/components/JobForm'

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

const jobTypeLabels = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship'
}

const jobTypeColors = {
  FULL_TIME: 'blue',
  PART_TIME: 'green',
  CONTRACT: 'orange',
  INTERNSHIP: 'purple'
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [opened, { open, close }] = useDisclosure(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    jobTitle: '',
    location: '',
    jobType: '',
    salaryRange: [0, 200000] as [number, number]
  })

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.jobTitle) params.append('jobTitle', filters.jobTitle)
      if (filters.location) params.append('location', filters.location)
      if (filters.jobType) params.append('jobType', filters.jobType)
      
      const response = await fetch(`/api/jobs?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch jobs',
          color: 'red'
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch jobs',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSearch = () => {
    fetchJobs()
  }

  const handleCreateJob = () => {
    setEditingJob(null)
    open()
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    open()
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Job deleted successfully',
          color: 'green'
        })
        fetchJobs()
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to delete job',
          color: 'red'
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete job',
        color: 'red'
      })
    }
  }

  const handleJobSaved = () => {
    close()
    fetchJobs()
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Job Posting Management</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreateJob}>
          Create Job
        </Button>
      </Group>

      {/* Filters */}
      <Card withBorder mb="xl">
        <Title order={3} mb="md">Filters</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              label="Job Title"
              placeholder="Search by job title"
              value={filters.jobTitle}
              onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              label="Location"
              placeholder="Search by location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Job Type"
              placeholder="Select job type"
              value={filters.jobType}
              onChange={(value) => setFilters({ ...filters, jobType: value || '' })}
              data={[
                { value: '', label: 'All Types' },
                { value: 'FULL_TIME', label: 'Full-time' },
                { value: 'PART_TIME', label: 'Part-time' },
                { value: 'CONTRACT', label: 'Contract' },
                { value: 'INTERNSHIP', label: 'Internship' }
              ]}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Flex align="end" h="100%">
              <Button leftSection={<IconSearch size={16} />} onClick={handleSearch}>
                Search
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Job List */}
      {loading ? (
        <Center h={200}>
          <Loader size="lg" />
        </Center>
      ) : (
        <Grid>
          {jobs.length === 0 ? (
            <Grid.Col span={12}>
              <Center h={200}>
                <Text size="lg" c="dimmed">No jobs found</Text>
              </Center>
            </Grid.Col>
          ) : (
            jobs.map((job) => (
              <Grid.Col key={job.id} span={{ base: 12, md: 6, lg: 4 }}>
                <Card withBorder h="100%">
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Title order={4} lineClamp={1}>{job.jobTitle}</Title>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleEditJob(job)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                    
                    <Text fw={500}>{job.companyName}</Text>
                    <Text size="sm" c="dimmed">{job.location}</Text>
                    
                    <Group>
                      <Badge color={jobTypeColors[job.jobType]}>
                        {jobTypeLabels[job.jobType]}
                      </Badge>
                      <Text size="sm" fw={500}>{job.salaryRange}</Text>
                    </Group>
                    
                    <Text size="sm" lineClamp={3}>
                      {job.jobDescription}
                    </Text>
                    
                    <Text size="xs" c="dimmed">
                      Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))
          )}
        </Grid>
      )}

      {/* Job Form Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingJob ? 'Edit Job' : 'Create New Job'}
        size="lg"
      >
        <JobForm
          job={editingJob}
          onSave={handleJobSaved}
          onCancel={close}
        />
      </Modal>
    </Container>
  )
}

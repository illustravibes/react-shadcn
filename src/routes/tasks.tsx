import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tasks')({
  component: Tasks,
})

function Tasks() {
  return (
    <div>
      <h1>Tasks</h1>
    </div>
  )
}

import { render, type RenderOptions } from "@testing-library/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { createQueryClient } from "@etape/api-client/hooks"
import type { ReactElement } from "react"

const AllProviders = ({ children }: { children: React.ReactNode }) => {
    const queryClient = createQueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

const customRender = (ui: ReactElement, options?: RenderOptions) =>
    render(ui, { wrapper: AllProviders, ...options })

export * from "@testing-library/react"
export { customRender as render }

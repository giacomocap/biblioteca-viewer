import { AppProps } from "next/app"
import { NextPage } from "next/types"
import { ReactElement, ReactNode } from "react"

export type NextPageWithLayout<T> = NextPage<T> & {
    getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout<T> = AppProps & {
    Component: NextPageWithLayout<T>
}
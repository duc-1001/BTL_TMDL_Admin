"use client"
import {
  Globe,
  Smartphone,
  Building2,
  Clock,
  Eye,
  AlertCircle,
} from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import SystemTab from "@/components/setting/system-tab"
import ContactTab from "@/components/setting/contact-tab"
import LegalTab from "@/components/setting/lega-tab"
import LocalTab from "@/components/setting/local-tab"
import DisplayTab from "@/components/setting/display-tab"
import StatusTab from "@/components/setting/status-tab"
import { useQuery } from "@tanstack/react-query"
import { getSettingBySection } from "@/services/system.service"
import { SystemSettingsPayload } from "@/types/setting"

export default function GeneralSettingsPage() {
  const { data: systemData } = useQuery({
    queryKey: ["settings", "system"],
    queryFn: () => getSettingBySection<SystemSettingsPayload>("system"),
  })

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cài đặt hệ thống</CardTitle>
        </CardHeader>

        <Tabs defaultValue="system">
          <TabsList
            className="
                flex w-full
                overflow-x-auto
                gap-1
                rounded-none
                border-b
                px-1
              "
          >
            <TabsTrigger
              value="system"
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Hệ thống</span>
            </TabsTrigger>

            <TabsTrigger
              value="contact"
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <Smartphone className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Liên hệ</span>
            </TabsTrigger>

            <TabsTrigger
              value="legal"
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Pháp lý</span>
            </TabsTrigger>

            <TabsTrigger
              value="locale"
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <Clock className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Địa phương</span>
            </TabsTrigger>

            <TabsTrigger
              value="display"
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <Eye className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Hiển thị</span>
            </TabsTrigger>

            <TabsTrigger
              value="status"
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Trạng thái</span>
            </TabsTrigger>
          </TabsList>
          {/* SYSTEM */}
          <SystemTab data={systemData} />
          {/* CONTACT */}
          <ContactTab />
          {/* LEGAL */}
          <LegalTab />
          {/* LOCALE */}
          <LocalTab />
          {/* DISPLAY */}
          <DisplayTab />
          {/* STATUS */}
          <StatusTab />
        </Tabs>
      </Card>
    </div>
  )
}

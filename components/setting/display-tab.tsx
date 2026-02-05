import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { CardContent } from "@/components/ui/card";
import { FormField } from "@/components/layout/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/layout/image-upload";
import { useForm } from "react-hook-form";
import { SystemSettings, SystemSettingsSchema } from "@/schemas/system.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Save, UploadIcon, X } from "lucide-react";
import { uploadFile } from "@/services/upload.service";
import { SystemSettingsPayload } from "@/types/setting";

const DisplayTab = () => {


  return (
    <TabsContent value="display">
      <CardContent className="space-y-6">
        <FormField label="Tiêu đề trình duyệt">
          <Input />
        </FormField>
        <FormField label="Số mục mỗi trang">
          <Input type="number" />
        </FormField>
      </CardContent>
    </TabsContent>
  );
};

export default DisplayTab;

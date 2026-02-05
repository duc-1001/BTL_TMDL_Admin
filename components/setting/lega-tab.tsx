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

const LegalTab = () => {
    

    return (
        <TabsContent value="legal">
            <CardContent className="grid md:grid-cols-2 gap-6">
              <FormField label="Tên doanh nghiệp">
                <Input />
              </FormField>
              <FormField label="Số đăng ký kinh doanh">
                <Input />
              </FormField>
              <FormField label="Đại diện pháp lý">
                <Input />
              </FormField>
              <FormField label="Địa chỉ pháp lý">
                <Textarea rows={2} />
              </FormField>
            </CardContent>
          </TabsContent>
    );
};

export default LegalTab;

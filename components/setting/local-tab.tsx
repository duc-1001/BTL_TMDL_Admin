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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const LocalTab = () => {
    

    return (
        <TabsContent value="locale">
            <CardContent className="grid md:grid-cols-2 gap-6">
              <FormField label="Múi giờ">
                <Select defaultValue="UTC+7">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC+7">UTC+7</SelectItem>
                    <SelectItem value="UTC+8">UTC+8</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Quốc gia">
                <Input />
              </FormField>

              <FormField label="Định dạng ngày">
                <Select defaultValue="DD/MM/YYYY">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">
                      DD/MM/YYYY
                    </SelectItem>
                    <SelectItem value="YYYY-MM-DD">
                      YYYY-MM-DD
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Định dạng giờ">
                <Select defaultValue="HH:mm:ss">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HH:mm:ss">
                      24h
                    </SelectItem>
                    <SelectItem value="hh:mm A">
                      12h
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </CardContent>
          </TabsContent>
    );
};

export default LocalTab;

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, X, ImageIcon, Loader2, ArrowLeft } from "lucide-react";
import { createStories } from "@/services/story";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default function StoryUploadPage({ params }: PageProps) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      setErrorMessage("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);

    // 미리보기 생성
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setErrorMessage(null);

    if (images.length === 0) {
      setErrorMessage("최소 하나 이상의 이미지를 선택해주세요.");
      setIsUploading(false);
      return;
    }

    try {
      await createStories(Number(params.id), images);
      setSuccessMessage("스토리가 성공적으로 업로드되었습니다.");
      router.push(`/sessions/${params.id}`);
    } catch (error: any) {
      console.error("Failed to upload stories:", error);
      if (error.response?.status === 403) {
        setErrorMessage("해당 세션의 멤버만 스토리를 업로드할 수 있습니다.");
      } else {
        setErrorMessage("스토리 업로드 중 오류가 발생했습니다.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/sessions/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            세션으로 돌아가기
          </Link>
        </Button>

        <Card className="border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#5D4037]">
              스토리 업로드
            </CardTitle>
            <CardDescription className="text-[#33691E]">
              여러 개의 스토리를 한 번에 업로드할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm mb-4">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="images" className="text-[#5D4037]">
                  이미지
                </Label>

                {imagePreviews.length === 0 ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      이미지를 선택하거나 여기에 드래그하세요
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF 파일만 지원됩니다 (최대 10MB)
                    </p>
                    <Input
                      id="images"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                      multiple
                      disabled={isUploading}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden"
                      >
                        <img
                          src={preview}
                          alt={`미리보기 ${index + 1}`}
                          className="w-full h-32 object-cover bg-gray-100"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={() => handleRemoveImage(index)}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors h-32 flex items-center justify-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div>
                        <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-xs text-gray-500">
                          더 추가하기
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#33691E] hover:bg-[#1B5E20]"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    업로드 중...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {images.length}개의 이미지 업로드
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500">
              업로드한 콘텐츠는 MC Archieve의 커뮤니티 가이드라인을 준수해야
              합니다.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

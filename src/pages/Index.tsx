import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type FilterType = 'brightness' | 'contrast' | 'saturate' | 'blur' | 'grayscale';

interface Filters {
  brightness: number;
  contrast: number;
  saturate: number;
  blur: number;
  grayscale: number;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    blur: 0,
    grayscale: 0,
  });
  const [activeTab, setActiveTab] = useState('gallery');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setActiveTab('editor');
        toast.success('Изображение загружено');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilterChange = (filter: FilterType, value: number[]) => {
    setFilters(prev => ({ ...prev, [filter]: value[0] }));
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'vintage':
        setFilters({ brightness: 110, contrast: 90, saturate: 80, blur: 0, grayscale: 20 });
        break;
      case 'vivid':
        setFilters({ brightness: 105, contrast: 120, saturate: 130, blur: 0, grayscale: 0 });
        break;
      case 'bw':
        setFilters({ brightness: 100, contrast: 110, saturate: 0, blur: 0, grayscale: 100 });
        break;
      case 'soft':
        setFilters({ brightness: 105, contrast: 90, saturate: 95, blur: 1, grayscale: 0 });
        break;
      default:
        setFilters({ brightness: 100, contrast: 100, saturate: 100, blur: 0, grayscale: 0 });
    }
    toast.success(`Применён фильтр: ${preset}`);
  };

  const handleRemoveBackground = () => {
    toast.info('Удаление фона (демо-версия)');
  };

  const handleEnhance = () => {
    setFilters({ brightness: 110, contrast: 115, saturate: 110, blur: 0, grayscale: 0 });
    toast.success('Качество улучшено');
  };

  const handleStylize = () => {
    toast.info('Стилизация (демо-версия)');
  };

  const handleExport = () => {
    if (!selectedImage) {
      toast.error('Выберите изображение');
      return;
    }
    toast.success('Изображение экспортировано');
  };

  const resetFilters = () => {
    setFilters({ brightness: 100, contrast: 100, saturate: 100, blur: 0, grayscale: 0 });
    toast.info('Фильтры сброшены');
  };

  const getFilterStyle = () => {
    return {
      filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) grayscale(${filters.grayscale}%)`,
      transition: 'filter 0.3s ease',
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Icon name="Sparkles" className="text-primary-foreground" size={20} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">PhotoEditor</h1>
          </div>
          <Button onClick={handleExport} className="gap-2">
            <Icon name="Download" size={18} />
            Экспорт
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="gallery" className="gap-2">
              <Icon name="Images" size={16} />
              Галерея
            </TabsTrigger>
            <TabsTrigger value="editor" className="gap-2" disabled={!selectedImage}>
              <Icon name="Wand2" size={16} />
              Редактор
            </TabsTrigger>
            <TabsTrigger value="filters" className="gap-2" disabled={!selectedImage}>
              <Icon name="SlidersHorizontal" size={16} />
              Фильтры
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2" disabled={!selectedImage}>
              <Icon name="Wrench" size={16} />
              Инструменты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-0">
            <Card className="p-12 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-col items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <Icon name="ImagePlus" size={40} className="text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Загрузите изображение</h2>
                  <p className="text-muted-foreground mb-6">
                    Поддерживаются JPG, PNG, GIF до 10MB
                  </p>
                </div>
                <Button size="lg" onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <Icon name="Upload" size={18} />
                  Выбрать файл
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="editor" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Preview"
                      style={getFilterStyle()}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <Icon name="Image" size={64} className="text-muted-foreground" />
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Palette" size={20} />
                  Быстрые фильтры
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => applyPreset('original')}
                  >
                    <Icon name="RotateCcw" size={18} />
                    Оригинал
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => applyPreset('vintage')}
                  >
                    <Icon name="Camera" size={18} />
                    Винтаж
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => applyPreset('vivid')}
                  >
                    <Icon name="Zap" size={18} />
                    Яркий
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => applyPreset('bw')}
                  >
                    <Icon name="Contrast" size={18} />
                    Ч/Б
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => applyPreset('soft')}
                  >
                    <Icon name="Cloud" size={18} />
                    Мягкий
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Preview"
                      style={getFilterStyle()}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <Icon name="Image" size={64} className="text-muted-foreground" />
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Icon name="SlidersHorizontal" size={20} />
                    Настройки
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Сброс
                  </Button>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Sun" size={16} />
                        Яркость
                      </label>
                      <span className="text-sm text-muted-foreground">{filters.brightness}%</span>
                    </div>
                    <Slider
                      value={[filters.brightness]}
                      onValueChange={(v) => handleFilterChange('brightness', v)}
                      min={0}
                      max={200}
                      step={1}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Circle" size={16} />
                        Контраст
                      </label>
                      <span className="text-sm text-muted-foreground">{filters.contrast}%</span>
                    </div>
                    <Slider
                      value={[filters.contrast]}
                      onValueChange={(v) => handleFilterChange('contrast', v)}
                      min={0}
                      max={200}
                      step={1}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Droplet" size={16} />
                        Насыщенность
                      </label>
                      <span className="text-sm text-muted-foreground">{filters.saturate}%</span>
                    </div>
                    <Slider
                      value={[filters.saturate]}
                      onValueChange={(v) => handleFilterChange('saturate', v)}
                      min={0}
                      max={200}
                      step={1}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Sparkles" size={16} />
                        Размытие
                      </label>
                      <span className="text-sm text-muted-foreground">{filters.blur}px</span>
                    </div>
                    <Slider
                      value={[filters.blur]}
                      onValueChange={(v) => handleFilterChange('blur', v)}
                      min={0}
                      max={10}
                      step={0.5}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Minus" size={16} />
                        Ч/Б
                      </label>
                      <span className="text-sm text-muted-foreground">{filters.grayscale}%</span>
                    </div>
                    <Slider
                      value={[filters.grayscale]}
                      onValueChange={(v) => handleFilterChange('grayscale', v)}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Preview"
                      style={getFilterStyle()}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <Icon name="Image" size={64} className="text-muted-foreground" />
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Wrench" size={20} />
                  AI Инструменты
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-auto py-4"
                    onClick={handleRemoveBackground}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <Icon name="Eraser" size={18} />
                        <span className="font-semibold">Удалить фон</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Автоматическое удаление фона
                      </span>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-auto py-4"
                    onClick={handleEnhance}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <Icon name="Sparkles" size={18} />
                        <span className="font-semibold">Улучшить качество</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        AI улучшение изображения
                      </span>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-auto py-4"
                    onClick={handleStylize}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <Icon name="Paintbrush" size={18} />
                        <span className="font-semibold">Стилизация</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Применить художественный стиль
                      </span>
                    </div>
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Icon name="Info" size={16} />
                    Подсказка
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Используйте вкладку "Фильтры" для точной настройки параметров изображения
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

import ReactMarkdown from 'react-markdown'
import type { ProjectDetail } from '@/types/project'
import { useTheme } from 'next-themes'

interface ProjectDetailProps {
  project: ProjectDetail
}

interface NotionBlock {
  id: string;
  type: string;
  paragraph?: { rich_text: any[] };
  heading_1?: { rich_text: any[] };
  heading_2?: { rich_text: any[] };
  heading_3?: { rich_text: any[] };
  bulleted_list_item?: { rich_text: any[] };
  numbered_list_item?: { rich_text: any[] };
  to_do?: { checked: boolean; rich_text: any[] };
  image?: { 
    file?: { url: string }; 
    external?: { url: string }; 
    caption?: { plain_text: string }[] 
  };
  column_list?: { children?: NotionBlock[] };
  column?: { children?: NotionBlock[] };
}

function renderBlock(block: NotionBlock): React.ReactNode {
  const { theme } = useTheme()

  switch (block.type) {
    case 'paragraph':
      return <p key={block.id} className="mb-4 text-base">{block.paragraph?.rich_text.map((rt, index) => renderRichText(rt, index))}</p>
    case 'heading_1':
      return <h1 key={block.id} className="text-3xl font-bold mb-6 mt-8">{block.heading_1?.rich_text.map((rt, index) => renderRichText(rt, index))}</h1>
    case 'heading_2':
      return <h2 key={block.id} className="text-2xl font-bold mb-4 mt-6">{block.heading_2?.rich_text.map((rt, index) => renderRichText(rt, index))}</h2>
    case 'heading_3':
      return <h3 key={block.id} className="text-xl font-bold mb-3 mt-5">{block.heading_3?.rich_text.map((rt, index) => renderRichText(rt, index))}</h3>
    case 'bulleted_list_item':
      return <li key={block.id} className="mb-2">{block.bulleted_list_item?.rich_text.map((rt, index) => renderRichText(rt, index))}</li>
    case 'numbered_list_item':
      return <li key={block.id} className="mb-2">{block.numbered_list_item?.rich_text.map((rt, index) => renderRichText(rt, index))}</li>
    case 'to_do':
      return (
        <div key={block.id} className="flex items-center mb-2">
          <input type="checkbox" checked={block.to_do?.checked} readOnly className="mr-2" />
          <span>{block.to_do?.rich_text.map((rt, index) => renderRichText(rt, index))}</span>
        </div>
      )
    case 'image':
      return (
        <figure key={block.id} className="my-6">
          <img 
            src={block.image?.file?.url || block.image?.external?.url || "/placeholder.svg"} 
            alt={block.image?.caption?.[0]?.plain_text || 'Project image'} 
            className="w-full h-auto"
            style={{ 
              filter: theme === 'dark' ? 'invert(97%) sepia(38%) saturate(319%) hue-rotate(313deg) brightness(92%) contrast(89%)' : 'none',
            }}
          />
          {block.image?.caption?.[0]?.plain_text && (
            <figcaption className="text-sm text-center mt-2">{block.image.caption[0].plain_text}</figcaption>
          )}
        </figure>
      )
    case 'column_list':
      return (
        <div key={block.id} className="flex flex-wrap -mx-2 my-4">
          {block.column_list?.children?.map((column) => renderBlock(column)) || 
            <p>Empty column list</p>}
        </div>
      )
    case 'column':
      return (
        <div key={block.id} className="w-full md:w-1/2 px-2">
          {block.column?.children?.map((child) => renderBlock(child)) || 
            <p>Empty column</p>}
        </div>
      )
    default:
      return <p key={block.id} className="mb-4 text-base">Unsupported block type: {block.type}</p>
  }
}

function renderRichText(text: any, index: number): React.ReactNode {
  if (!text?.text) {
    return null;
  }
  let renderedText = text.text.content;
  if (text.annotations?.bold) {
    renderedText = <strong key={`${text.plain_text}-${index}`}>{renderedText}</strong>;
  }
  if (text.annotations?.italic) {
    renderedText = <em key={`${text.plain_text}-${index}`}>{renderedText}</em>;
  }
  if (text.annotations?.strikethrough) {
    renderedText = <s key={`${text.plain_text}-${index}`}>{renderedText}</s>;
  }
  if (text.annotations?.underline) {
    renderedText = <u key={`${text.plain_text}-${index}`}>{renderedText}</u>;
  }
  if (text.annotations?.code) {
    renderedText = <code key={`${text.plain_text}-${index}`} className="bg-muted px-1 py-0.5 rounded">{renderedText}</code>;
  }
  if (text.href) {
    renderedText = <a href={text.href} key={`${text.plain_text}-${index}`} className="text-accent hover:underline">{renderedText}</a>;
  }
  return renderedText;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="bg-background text-foreground">
      <div className="w-full px-[60px] py-16">
        <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}


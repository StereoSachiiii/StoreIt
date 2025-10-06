// page.tsx
import Card from '@/components/Card';
import Sort from '@/components/Sort'
import { getfiles } from '@/lib/actions/file.actions'

const Page = async ({ params }: { params: Promise<{ type: string }> }) => {
  // Await params in Next.js 15+
  const { type } = await params;
  
  // Fetch files directly on server
  const fileList = await getfiles();
  const allFiles = fileList?.documents || [];
  
  // Filter files based on type
  const files = allFiles.filter((file: any) => {
    const fileType = file.type?.toLowerCase();
    
    switch (type) {
      case 'documents':
        return fileType === 'document';
      case 'images':
        return fileType === 'image';
      case 'media':
        return fileType === 'video' || fileType === 'audio';
      case 'others':
        return !['document', 'image', 'video', 'audio'].includes(fileType);
      default:
        return true; // Show all if no specific type
    }
  });
  
  console.log("Total Files:", allFiles.length);
  console.log("Filtered Files:", files.length);

  return (
    <div className='p-6 flex flex-col w-full h-full gap-6 bg-gray-200 flex-1'>
      <section className='w-full'>
        <h1 className='capitalize text-3xl p-4'>{type}</h1>

        <div className='flex justify-between'>
          <p>
            Total: {files.length} files
          </p>
          <div>
            <p>Sort By:</p>
            <Sort />
          </div>
        </div>
      </section>

      <section className='w-full h-full grid gap-2 grid-cols-3'>
        {files.length === 0 ? (
          <div className='col-span-3 text-center p-8 text-gray-500'>
            No {type} found
          </div>
        ) : (
          files.map((file: any, index: number) => (
            <div key={file.$id || index} className='p-3 border overflow-hidden bg-white rounded'>
              <Card file={file} />
            </div>
          ))
        )}
      </section>
    </div>
  )
}

export default Page
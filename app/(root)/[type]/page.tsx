import Card from '@/components/Card';
import Sort from '@/components/Sort'
import { getfiles } from '@/lib/actions/file.actions'

const Page = async ({ 
  params,
  searchParams 
}: { 
  params: Promise<{ type: string }>
  searchParams: Promise<{ query?: string }>
}) => {
  const { type } = await params;
  const { query: searchText = "" } = await searchParams;
  
  const fileList = await getfiles({ query: searchText });
  const allFiles = fileList?.documents || [];
  
  // Filter by type
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
        return true; 
    }
  });
  
  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-7xl mx-auto'>
        <section className='mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 capitalize mb-4 sm:mb-6'>
            {!searchText && type}
            {searchText && (`${type} : search results for : ${searchText}`)  }
          </h1>

          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200'>
            <div className='flex items-center gap-2'>
              <span className='text-sm sm:text-base font-medium text-slate-700'>Total:</span>
              <span className='inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1 bg-indigo-100 text-indigo-700 font-semibold rounded-full text-sm'>
                {files.length}
              </span>
              <span className='text-sm sm:text-base text-slate-600'>
                {files.length === 1 ? 'file' : 'files'}
              </span>
            </div>
            
            <div className='flex items-center gap-3'>
              <span className='text-sm font-medium text-slate-700'>Sort by:</span>
              <Sort />
            </div>
          </div>
        </section>

        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6'>
          {files.length === 0 ? (
            <div className='col-span-full flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24'>
              <div className='text-center space-y-3'>
                <div className='w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-slate-200 rounded-full flex items-center justify-center mb-4'>
                  <svg className='w-8 h-8 sm:w-10 sm:h-10 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
                  </svg>
                </div>
                <p className='text-lg sm:text-xl font-medium text-slate-600'>
                  No {type} found
                </p>
                <p className='text-sm text-slate-500 max-w-xs mx-auto'>
                  {searchText ? 'Try adjusting your search terms' : 'Upload some files to get started'}
                </p>
              </div>
            </div>
          ) : (
            files.map((file: any, index: number) => (
              <div 
                key={file.$id || index} 
                className='group bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 hover:border-indigo-300 transition-all duration-300 overflow-hidden'
              >
                <Card file={file} />
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}

export default Page
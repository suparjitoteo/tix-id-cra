import TagLabel from './TagLabel'

export default function MerchantTag({ merchant_name }: { merchant_name: string}) {
  let bgColor = 'bg-blue-600'
  if (merchant_name === 'CGV')
    bgColor = 'bg-red-600'
  else if (merchant_name === 'XXI')
    bgColor = 'bg-yellow-600'

  return <TagLabel
    bgColor={bgColor}
    textColor='text-white'
    text={merchant_name}
  />
}

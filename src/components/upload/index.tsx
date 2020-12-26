import React, { useState, useEffect, useRef } from 'react'
import { Upload, Spin, message } from 'antd'
import { UploadChangeParam, RcFile } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import { PlusOutlined } from '@ant-design/icons'
import { useBoolean } from 'ahooks'
import { getQiniuToken } from '@/api/global'
import { getRandomStr } from '@/utils'
import { isString } from '@/utils/type'
import styles from './index.module.less'

// const QINIU_PREFIX = 'https://qiniu.qyhever.com/'
// const QINIU_UPLOAD_URL = 'https://upload-z2.qiniup.com'
const QINIU_PREFIX = ''
const QINIU_UPLOAD_URL = '/upload'

const defaultProps = {
  uploadClassName: '',
  imgClassName: '',
  imgStyle: {},
  limitSize: 2,
  limit: 8
}

type DefaultProps = typeof defaultProps

type IProps = {
  value?: string | string[]
  uploadClassName?: string
  imgClassName?: string
  imgStyle?: object
  limitSize?: number
  limit?: number
  onChange?: (val: string | string[]) => void
} & Partial<DefaultProps>

const UploadImage = function (props: IProps & DefaultProps) {
  const { value, uploadClassName, imgClassName, imgStyle, limitSize, limit, onChange } = props
  const [params, setParams] = useState({})
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, { setTrue: showLoading, setFalse: hideLoading }] = useBoolean(false)
  const inited = useRef(false)
  const isSingle = isString(value)

  // 当 value 被父组件修改时，更新 fileList，此后不再更新
  useEffect(() => {
    if (Array.isArray(value) && !inited.current) {
      if (!value.length) {
        return
      }
      inited.current = true
      const ret = value.map((item) => {
        return {
          type: 'image/*',
          uid: getRandomStr(),
          name: item.replace(/.+\//, ''),
          size: 2097152,
          url: item,
          status: 'done' // UploadFileStatus
        } as const
      })
      setFileList(ret)
    }
  }, [value])

  const handleBeforeUpload = async (file: RcFile) => {
    // limit
    if (!isSingle && limit && limit === fileList.length) {
      message.destroy()
      message.error(`最多上传 ${limit} 张!`)
      return Promise.reject(false)
    }
    // format
    const isImg = /^image\/\w+$/i.test(file.type)
    if (!isImg) {
      message.destroy()
      message.error('只能上传 JPG、PNG、GIF 格式!')
      return Promise.reject(false)
    }
    // memory
    const isLtMB = file.size / 1024 / 1024 < limitSize
    if (!isLtMB) {
      message.destroy()
      message.error(`最大不能超过 ${limitSize}M !`)
      return Promise.reject(false)
    }
    try {
      showLoading()
      const { token } = await getQiniuToken()
      const fileName = file.name.replace(/\..*$/, '')
      setParams({
        token,
        key: getRandomStr() + fileName
      })
    } catch (error) {
      console.log(error)
      hideLoading()
      return Promise.reject(false)
    }
  }

  const handleChange = (info: UploadChangeParam) => {
    if (!isSingle) {
      setFileList(info.fileList)
    }
    if (info.file.status === 'done') {
      const { response } = info.file
      const url = QINIU_PREFIX + response.key
      hideLoading()
      let ret: string | string[] = url
      if (Array.isArray(value)) {
        ret = value.concat(url)
      }
      onChange && onChange(ret)
    }
  }
  const handleRemove = (file: RcFile) => {
    const ret = fileList
      .filter(v => v.uid !== file.uid)
      .map(v => v.url || (v.response && v.response.key) || v.thumbUrl)
    onChange && onChange(ret)
  }
  const onPreview = (file: UploadFile) => {
    const url = file.url || file.thumbUrl || file?.response?.key
    if (url.indexOf('data:image') >= 0) {
      const image = new Image()
      image.src = url
      const imgWindow = window.open(url) || {} as Window
      imgWindow.document.write(image.outerHTML)
    } else {
      window.open(url)
    }
  }
  const singleNode = (
    <>
      <Spin className={styles.spin} spinning={uploading}></Spin>
      {value
        ? <img src={value as string} style={imgStyle} className={`${styles.image} ${imgClassName}`} alt="avatar" object-fit="cover" />
        : <PlusOutlined className={styles.uploadPlus} />
      }
      <div className={styles.uploadMask}>
        <PlusOutlined className={styles.uploadMaskPlus} />
      </div>
    </>
  )
  const multipleNode = fileList.length >= limit ? null : (
    <PlusOutlined className={styles.uploadMaskPlus} />
  )
  return (
    <Upload
      className={`${styles.uploadContainer} ${uploadClassName} ${value ? styles.hoverMask : ''}`}
      action={QINIU_UPLOAD_URL}
      listType="picture-card"
      data={params}
      multiple={!isSingle}
      showUploadList={!isSingle}
      fileList={fileList}
      beforeUpload={handleBeforeUpload}
      onChange={handleChange}
      onRemove={handleRemove}
      onPreview={onPreview}
    >
      {
        isSingle ? singleNode : multipleNode
      }
    </Upload>
  )
} as React.FC<IProps>
UploadImage.defaultProps = defaultProps

export default React.memo(UploadImage)

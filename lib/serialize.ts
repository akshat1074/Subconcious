export function serializeContent(item: any) {
    const { previewImage, previewDescription, previewSiteName, previewFavicon, embedding, ...rest } = item
    return { ...rest, preview: { image: previewImage, description: previewDescription, siteName: previewSiteName, favicon: previewFavicon } }
  }
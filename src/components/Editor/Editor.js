import React from 'react';
// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import { Editor as TextEditor } from '@tinymce/tinymce-react';
import axios from "axios";

const Editor = props => {
  const { model, onModelChange , height = 400} = props;
  const params = {
    "site" : axios.defaults.headers.common['site']
  }

  const serialize = function(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  
  return (
    <TextEditor
      apiKey={window.editor_api_key}
      initialValue={model}
      init={
        {
          height: height,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | link image media | \
            bullist numlist outdent indent | removeformat | help preview',
          /* without images_upload_url set, Upload tab won't show up*/
          
          convert_urls: false,
          // statusbar: false,
          image_title: true,
          // automatic_uploads: true,
          // images_upload_url: 'http://127.0.0.1:8000/laravel-filemanager',
          images_upload_url: axios.defaults.baseURL + '/api/upload-gateway?' + serialize(params),
          file_picker_types: 'image',
        }
      }
      onEditorChange={onModelChange}
    />
    /*<CKEditor
        editor={ ClassicEditor }
        data={model}
        config={{}
          // {plugins : []}
          // { toolbar: [ 'Heading', 'Link' ,'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote' ,"undo" ,"redo"]}
        }
        onInit={ editor => {
        } }
        onChange={ ( event, editor ) => {
            const data = editor.getData();
            if(onModelChange){
              onModelChange(data)
            }
        } }
        onBlur={ ( event, editor ) => {
            console.log( 'Blur.', editor );
        } }
        onFocus={ ( event, editor ) => {
            console.log( 'Focus.', editor );
        } }
    />*/
  );
};

export default Editor;

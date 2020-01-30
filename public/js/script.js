function showOrHideInfo(item)
{
    const session = item.getAttribute('data');
    const element = document.getElementById(session);

    element.classList.toggle('detail-hide');

    item.innerHTML = item.innerHTML == 'Esconder' ? 'Mostrar' : 'Esconder';

}

const showOrHideAll = document.querySelectorAll('span.toggle-item');

if (showOrHideAll)
{
    showOrHideAll.forEach(showOrHide =>
    {
        showOrHide.addEventListener('click', (event) => showOrHideInfo(event.target));
    });
}

function addNewIngridentOrStep(item)
{
    const dataAttribute = item.getAttribute('data');
    const element = document.querySelector(`#${dataAttribute}s`);

    const fieldContainer = document.querySelector(`.${dataAttribute}`);

    const newField = fieldContainer.cloneNode(true);

    if (newField.children[0].value == '') return false;

    newField.children[0].value = '';
    element.appendChild(newField);
}

const addButtons = document.querySelectorAll('.field-item > button');

addButtons.forEach(button => 
{
    button.addEventListener('click', (event) =>
    {
        event.preventDefault();
        addNewIngridentOrStep(event.target);
    });
});

const PhotosUpload =
{
    input: '',
    preview: document.querySelector('#photos-preview'),
    files: [],
    uploadLimit: () => 5,
    totalUploaded: 0,

    handleFileInput(event)
    {

        const { files: fileList } = event.target;
        this.input = event.target;

        if (this.hasLimit(event))
            return;

        Array.from(fileList).forEach(file =>
        {
            this.files.push(file);

            const fileReader = new FileReader();

            fileReader.onload = () =>
            {
                const image = new Image();
                image.src = String(fileReader.result);
                const div = this.getContainer(image);
                this.preview.appendChild(div);

                this.totalUploaded++;
            };

            fileReader.readAsDataURL(file);
        });

        this.input.files = this.getAllFiles();
    },

    hasLimit(event)
    {
        const { uploadLimit, totalUploaded, input } = this;
        const { files: fileList } = input;

        if ((fileList.length + totalUploaded) > uploadLimit())
        {
            alert(`A quantidade máxima de imagens permitida é ${uploadLimit()}`);
            event.preventDefault();
            return true;
        }
        return false;
    },

    getContainer(image)
    {
        const div = document.createElement('div');
        div.classList.add('photo');

        div.onclick = this.removePhoto;

        div.appendChild(image);
        div.appendChild(this.getRemoveButton());

        return div;
    },

    removePhoto(event)
    {
        const photoDiv = event.target.parentNode;
        const photoArray = Array.from(PhotosUpload.preview.children);
        const index = photoArray.indexOf(photoDiv);

        PhotosUpload.files.splice(index, 1);
        PhotosUpload.input.files = PhotosUpload.getAllFiles();

        photoDiv.remove();

        PhotosUpload.totalUploaded--;
    },

    getAllFiles()
    {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();

        this.files.forEach(file => dataTransfer.items.add(file));

        return dataTransfer.files;
    },

    getRemoveButton()
    {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = 'close';

        return button;
    },

    removeOldPhoto(event)
    {
        const photoDiv = event.target.parentNode;

        if (photoDiv.id)
        {
            const removedFiles = document.querySelector('input[name="removedImagens"]');
            if (removedFiles)
            {
                removedFiles.value += `${photoDiv.id},`;
            }
        }

        photoDiv.remove();

        this.totalUploaded--;
    }
};

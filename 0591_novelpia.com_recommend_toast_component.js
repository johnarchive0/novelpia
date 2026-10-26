const recommend_toast_component = {
    template: `
    <div id="recommend_toast"></div>
    `,
    props: {
        type: {
            type: String,
            default: ""
        }
    },
    methods: {
      add_class : function () {
        const toast = document.getElementById('recommend_toast');
        
        toast.classList.add(this.type);
      }
    },
    mounted: function () {
        this.add_class();
    },
}

export default recommend_toast_component;
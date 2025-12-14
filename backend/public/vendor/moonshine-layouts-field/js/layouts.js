document.addEventListener('alpine:init', () => {
    Alpine.data('layouts', (url, column) => ({
        url: url,
        column: column,
        root: null,
        blocksContainer: null,
        init() {
            this.root = this.$root
            this.blocksContainer = this.root.querySelector('._layouts-blocks')
            this._reindex()
            const t = this

            MoonShine.iterable.sortable(
                this.blocksContainer,
                null,
                'layouts',
                null,
                {
                    handle: '.handle'
                },
                function(evt) {
                    t._reindex()
                }
            )
        },
        add(name) {
            const t = this

            let layoutsCount = {}
            const layouts = document.querySelectorAll('._layout-value')
            layouts.forEach(function(l) {
                layoutsCount[l.value] = layoutsCount[l.value] ? layoutsCount[l.value]+1 : 1
            })


            MoonShine.request(t, t.url, 'post', {
                field: t.column,
                name: name,
                counts: layoutsCount
            }, {}, {
                afterResponse: function(data) {
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = data.html ?? data.htmlData[0].html ?? '';

                    const appended = [];
                    while (tempContainer.firstChild) {
                        const child = tempContainer.firstChild;
                        if (child && child.nodeType === 1) {
                            appended.push(child);
                        }
                        t.blocksContainer.appendChild(child);
                    }

                    // Ensure Alpine initializes newly appended blocks (TinyMCE, collapses, etc.)
                    // Without this, some components may stay in a half-rendered state until a full page refresh.
                    if (window.Alpine?.initTree) {
                        appended.forEach(function(el) {
                            if (!el) return;
                            if (el._x_marker || el.__x) return;
                            window.Alpine.initTree(el);
                        });
                    }

                    t._reindex()
                }
            })
        },
        remove() {
            this.$el.closest('._layouts-block').remove()
            this._reindex()
        },
        _reindex() {
            const t = this

            this.$nextTick(function() {
                MoonShine.iterable.reindex(
                    t.blocksContainer,
                    '._layouts-block'
                )
            })
        }
    }))
})

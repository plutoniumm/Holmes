<div>
    <p>
        {[...Array(150)]
            .map((i) => (~~(Math.random() * 36)).toString(36))
            .join('')}
    </p>
    <p>
        {[...Array(150)]
            .map((i) => (~~(Math.random() * 36)).toString(36))
            .map((o) => (Math.round(Math.random()) ? o : o.toUpperCase()))
            .join('')}
    </p>
    <p>
        {[...Array(150)]
            .map((i) => (~~(Math.random() * 9)).toString(10))
            .join('')}
    </p>
    <p>
        {[...Array(150)]
            .map((i) => ~~(Math.random() * 127 + 1))
            .map((o) => String.fromCharCode(o))
            .join('')}
    </p>
</div>

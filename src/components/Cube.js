import Class from 'lowclass'
import forLength from 'army-knife/forLength';
import Node from '../core/Node'

/**
 * A scenegraph tree that lays things out in a cube form.
 *
 * TODO: extend from i-mesh, using a Cube geometry? Or perhaps this is a
 * CubeLayout, not necessarily a Cube mesh.
 *
 * TODO: this is written imperatively. How would it be declaratively?
 *
 * @class Cube
 * @extends Node
 */
export default
Class('Cube').extends( Node, ({ Super }) => ({

    /**
     * Create a new Cube.
     *
     * @constructor
     * @param {Number} size The integer width of the cube.
     */
    constructor(size, options) {

        // cubes, the same size on all sides
        const self = Super(this).constructor({size: [size, size, size], ...options});

        //GenericSync.register({
            //mouse: MouseSync,
            //touch: TouchSync
        //});

        self.size = size;
        self.sides = [];

        forLength(6, n => self._createCubeSide(n));

        return self
    },

    /**
     * Creates the 6 sides of the cube (the leafnodes of the scenegraph).
     *
     * @private
     * @param {Number} index The index (a integer between 0 and 5) that specifies which side to create.
     */
    _createCubeSide(index) {
        const rotator = new Node({
            align: [0.5, 0.5],
            mountPoint: [0.5, 0.5],
        })

        const side = new Node({
            align: [0.5, 0.5],
            mountPoint: [0.5, 0.5],
            size: [this.size, this.size],
        })

        this.sides.push(side)

        rotator.add(side)

        // TODO: make a new GenericSync-like thing based on Famous?
        //const sync = new GenericSync(['mouse','touch']);
        //side.pipe(sync);
        //sync.pipe(this.options.handler);

        // rotate and place each side.
        if (index < 4) // 4 sides
            rotator.rotation.y = 90 * index
        else // top/bottom
            rotator.rotation.x = 90 * ( index % 2 ? -1 : 1 )

        side.position.z = this.size / 2

        this.add(rotator)
    },

    /**
     * Set the content for the sides of the cube.
     *
     * @param {Array} content An array containing [Node](#infamous/motor/Node)
     * instances to place in the cube sides. Only the first 6 items are used,
     * the rest are ignored.
     */
    setContent(content) {
        forLength(6, index => {
            //this.cubeSideNodes[index].set(null); // TODO: how do we erase previous content?
            this.sides[index].add(content[index])
        })
        return this;
    },
}))
